<template>
    <div
        class="interact_area"
        :style="{
            left: (scale * interactArea.posX) / baseSize + 'em',
            top: (scale * interactArea.posY) / baseSize + 'em',
        }"
        @click="onClick"
    >
        <div class="circle"></div>
        <div class="point"></div>
        <div class="text">{{ interactArea.word }}</div>
    </div>
</template>

<style lang="scss" scoped>
.interact_area {
    position: absolute;
    width: 0.76em;
    height: 0.76em;
    pointer-events: auto;
    transform: translate(-50%, -50%);
    font-family: readingjourney;
    .point {
        position: absolute;
        background-color: #ff6b49;
        width: 0.16em;
        height: 0.16em;
        left: 0.38em;
        top: 0.38em;
        border-radius: 0.16em;
        transform: translate(-50%, -50%);
    }
    .circle {
        position: absolute;
        background-color: #ffd769;
        width: 0.16em;
        height: 0.16em;
        left: 0.38em;
        top: 0.38em;
        border-radius: 0.76em;
        transform: translate(-50%, -50%);
        opacity: 0.5;
        animation: step 1s ease-out infinite;
        @keyframes step {
            100% {
                width: 0.76em;
                height: 0.76em;
            }
        }
    }
    .text {
        pointer-events: none;
        position: absolute;
        font-size: 0.5em;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-weight: bold;
        text-shadow: #555568 0.1em 0 0, #555568 0 0.1em 0, #555568 -0.1em 0 0, #555568 0 -0.1em 0;
        visibility: hidden;
        white-space: nowrap;
    }
}
</style>

<script lang="ts">
import Vue from "vue";
import { baseSize } from "@/utils/screen";
import { InteractAreaData } from "@/types/TypesReading";

export default Vue.extend({
    name: "InteractArea",
    props: {
        interactArea: {
            type: Object,
            default: {} as InteractAreaData,
        },
        pronunciation: {
            type: String,
            default: "美音",
        },
        scale: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            timeID: -1,
            baseSize,
        };
    },
    destroyed() {
        clearTimeout(this.timeID);
    },
    methods: {
        onClick() {
            const text: HTMLDivElement = this.$el.querySelector(".text") as HTMLDivElement;
            const time: number = 0.8;
            text.style.visibility = "visible";
            text.style.transition = time + "s";
            text.style.top = -10 / baseSize + "em";
            this.timeID = window.setTimeout(() => {
                text.style.transition = "";
                text.style.visibility = "";
                text.style.top = "";
            }, time * 1000);
            const interactArea: InteractAreaData = this.interactArea as InteractAreaData;
            this.$emit(
                "playFloatTextAudioAction",
                this.pronunciation === "美音" ? interactArea.wordAudioUs : interactArea.wordAudioUk,
            );
        },
    },
});
</script>
