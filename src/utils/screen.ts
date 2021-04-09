import { Singleton } from "@/toolkit/base/Singleton";
import { Emitter } from "@/toolkit/base/Emitter";
import { EnumSystem } from "@/enums/EnumSystem";

export const baseSize: number = 100;

let rootElement: HTMLElement = document.documentElement;

export function setDesignPixel(element?: HTMLElement, designWidth?: number, designHeight?: number): void {
    if (element != null) {
        rootElement = element;
    }

    designWidth = designWidth || parseFloat(rootElement.dataset.designWidth as string) || 750;
    designHeight = designHeight || parseFloat(rootElement.dataset.designHeight as string) || 1334;

    const clientWidth: number = rootElement.clientWidth;
    const clientHeight: number = rootElement.clientHeight;
    let fontSize: number;

    if (designWidth / designHeight > clientWidth / clientHeight) {
        fontSize = (baseSize * clientWidth) / designWidth;
    } else {
        fontSize = (baseSize * clientHeight) / designHeight;
    }
    rootElement.style.fontSize = fontSize + "px";
    rootElement.dataset.fontSize = fontSize + "";
    rootElement.dataset.designWidth = designWidth + "";
    rootElement.dataset.designHeight = designHeight + "";
}

const resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
window.addEventListener(
    resizeEvt,
    evt => {
        setDesignPixel(rootElement);
        const emitter = Singleton.get(Emitter);
        emitter.emit(EnumSystem.SCREEN_RESIZE, evt);
    },
    false,
);
