import { EnumSystem } from "@/enums/EnumSystem";
import { Emitter } from "../toolkit/base/Emitter";
import { Singleton } from "../toolkit//base/Singleton";
import { audio } from "./audio";

export const PLAY_AUDIO_PROGRESS = "playAudioProgress";

export const isShell: boolean = /readingjourney/.test(navigator.userAgent.toLowerCase());
export const isWechat: boolean = /micromessenger/.test(navigator.userAgent.toLowerCase());

const context: Emitter = Singleton.get(Emitter);
if (isShell) {
    window?.bind_trigger("load", () => {
        context.emit(EnumSystem.SYSTEM_RESUME);
    });
    window?.bind_trigger("unload", () => {
        context.emit(EnumSystem.SYSTEM_PAUSE);
    });
} else {
    const onVisibilitychange = () => {
        if (document.hidden) {
            context.emit(EnumSystem.SYSTEM_PAUSE);
        } else {
            context.emit(EnumSystem.SYSTEM_RESUME);
        }
    };
    document.addEventListener("visibilitychange", onVisibilitychange);
}

const callbackMap: { [key: string]: (cbUrl: string, state: string) => void } = {};
function playAudioShell(url: string, onEnded?: Function): void {
    const emitter: Emitter = Singleton.get(Emitter);
    function callback(cbUrl: string, state: string) {
        if (url !== cbUrl) {
            return;
        }
        if (callbackMap[url] == null) {
            return;
        }
        switch (state) {
            case "paused":
            case "stop":
            case "ended":
                emitter.off(PLAY_AUDIO_PROGRESS, callback);
                delete callbackMap[url];
                if (onEnded) {
                    onEnded();
                }
                break;
            default:
        }
    }
    callbackMap[url] = callback;
    emitter.on(PLAY_AUDIO_PROGRESS, callback);
    window?.do_external("playAudio", url);
}

function stopAudioShell(url: string): void {
    const cb = callbackMap[url];
    if (cb != null) {
        const emitter: Emitter = Singleton.get(Emitter);
        emitter.off(PLAY_AUDIO_PROGRESS, cb);
        delete callbackMap[url];
    }
    window?.do_external("stopAudio", url);
}

if (isShell) {
    window?.bind_trigger(PLAY_AUDIO_PROGRESS, (url: string, state: string, currentTime: number, duration: number) => {
        const emitter: Emitter = Singleton.get(Emitter);
        emitter.emit(PLAY_AUDIO_PROGRESS, url, state, currentTime, duration);
    });
    audio.playAudio = playAudioShell;
    audio.stopAudio = stopAudioShell;
}

export function exitApp(): void {
    window?.do_external("disMissView");
}

export function completeApp(data: { message: string; type: string }): void {
    window?.do_external("sendNotification", {
        eventId: "showResult",
        data,
    });
}
