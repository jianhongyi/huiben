import { EnumSystem } from "@/enums/EnumSystem";
import { AudioController } from "../toolkit/audio/AudioController";
import { Emitter } from "../toolkit/base/Emitter";
import { Singleton } from "../toolkit/base/Singleton";

if (!AudioController.factory.available) {
    AudioController.factory.onAvailabled = function() {
        const emitter: Emitter = Singleton.get(Emitter);
        emitter.emit(EnumSystem.AUDIO_TAG_AVAILABLED);
        delete AudioController.factory.onAvailabled;
    };
}

function playAudio(url: string, onEnded?: Function): void {
    AudioController.playAudio(url).then(() => {
        if (onEnded != null) {
            onEnded();
        }
    });
}

function stopAudio(url: string): void {
    AudioController.stopAudio(url);
}

export const audio = {
    playAudio,
    stopAudio,
};
