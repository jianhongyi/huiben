<template>
    <div
        id="paragraph"
        class="paragraph"
        :style="{
            maxWidth: (scale * (showTranslate ? cnWidth : width)) / baseSize + 'em',
            left: (scale * posX) / baseSize - 0.1 + 'em',
            top: (scale * posY) / baseSize - 0.1 + 'em',
        }"
    >
        <div ref="bg" class="bg"></div>
        <div
            v-show="!showTranslate"
            ref="content"
            class="content"
            :style="{
                textAlign: textAlign,
                fontSize: (scale * fontSize) / baseSize + 'em',
                textIndent: hasIndent ? (2 * (scale * fontSize)) / baseSize + 'em' : null,
            }"
        >
            <span
                v-for="(sentence, sentenceIndex) in paragraph.sentences"
                :key="sentenceIndex"
                ref="sentences"
                :class="'sentence' + (playing && playingSentence === sentenceIndex ? ' playing' : '')"
                ><span
                    v-for="(word, wordIndex) in getWordsVO(sentence.entext)"
                    :key="wordIndex"
                    :class="'word' + (getKeyWordData(word, sentence.words) == null ? '' : ' key')"
                    @click="onWordClick($event, word, sentence.words)"
                    >{{ word }}</span
                ><br v-if="showNewline" />
            </span>
        </div>
        <div
            v-show="showTranslate"
            class="content-cn"
            :style="{
                textAlign: textAlign,
                fontSize: (scale * cnFontSize) / baseSize + 'em',
                textIndent: hasIndent ? (4 * (scale * cnFontSize)) / baseSize + 'em' : null,
            }"
        >
            <span
                v-for="(sentence, sentenceIndex) in paragraph.sentences"
                :key="sentenceIndex"
                :style="{
                    color: playing && playingSentence === sentenceIndex ? '#ff0000' : '',
                }"
                ><span v-for="(char, charIndex) in sentence.cntext.split('')" :key="charIndex">{{ char }}</span
                ><br v-if="cnShowNewline" />
            </span>
        </div>
        <div class="voice" @click="onVoiceClick">
            <img class="stop_bg" :style="{ display: playing ? 'none' : 'block' }" :src="reading_mute_png" />
            <img class="playing_bg" :style="{ display: playing ? 'block' : 'none' }" :src="reading_playing_bg_png" />
            <svg viewBox="0, 0, 73, 80" :class="playing ? 'steps_playing' : 'steps_stop'">
                <foreignObject class="html" width="73" height="80">
                    <div class="img" />
                </foreignObject>
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.paragraph {
    position: absolute;
    pointer-events: auto;
    padding: 0.1em;
    .bg {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        border-radius: 0.25em;
        box-shadow: 0em 0.02em 0.2em 0em rgba(0, 0, 0, 0.1);
    }
    .content {
        position: relative;
        .sentence {
            line-height: 110%;
            font-family: readingjourney;
            color: #000;
            &.playing {
                color: #ff0000;
            }
            .word {
                pointer-events: none;
                &.key {
                    pointer-events: auto;
                    border-bottom-style: dotted;
                    border-color: #f00;
                    border-width: 0.1em;
                }
            }
            &::after {
                content: " ";
            }
        }
    }
    .content-cn {
        position: relative;
        .sentence-cn {
            line-height: 110%;
            display: flex;
            flex-direction: row;
            color: #000;
        }
    }
    .voice {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-65%, -65%);
        .stop_bg {
            width: 0.98em;
            height: 1em;
        }
        .stop_bg:active {
            transform: scale(0.9, 0.9);
        }
        .playing_bg {
            width: 0.85em;
            height: 0.9em;
        }
        .playing_bg:active {
            transform: scale(0.9, 0.9);
        }
        .steps_stop {
            display: none;
        }
        /** prettier-ignore 禁止了prettier把PX转义成px，值为PX scss不会转义成rem，以此保持属性为px单位 */
        .steps_playing {
            position: absolute;
            left: 0.06em;
            top: 0.02em;
            width: 0.73em;
            height: 0.8em;
            .html {
                .img {
                    background: url("~static/img/reading/reading_voice.png") 0 0 no-repeat;
                    /* prettier-ignore */
                    width: 219PX;
                    /* prettier-ignore */
                    height: 80PX;
                    /* prettier-ignore */
                    background-size: 219PX 80PX;
                    animation: step 0.9s steps(3) infinite;
                }
                @keyframes step {
                    100% {
                        /* prettier-ignore */
                        background-position: -219PX 0;
                    }
                }
            }
        }
    }
}
</style>

<script lang="ts">
import Vue from "vue";
import { baseSize } from "@/utils/screen";
import { ParagraphData, WordData } from "@/types/TypesReading";
import { PropValidator } from "vue/types/options";
import { Singleton } from "@/toolkit/base/Singleton";
import { Emitter } from "@/toolkit/base/Emitter";
import { EnumSystem } from "@/enums/EnumSystem";

import reading_mute_png from "static/img/reading/reading_mute.png";
import reading_playing_bg_png from "static/img/reading/reading_playing_bg.png";

interface DefaultProps {
    paragraph: PropValidator<ParagraphData>;
    pronunciation: PropValidator<string>;
    scale: PropValidator<number>;
    showTranslate: PropValidator<boolean>;
    playingParagraph: PropValidator<number>;
    playingSentence: PropValidator<number>;
    itemIndex: PropValidator<number>;
}

const SET_PLAYING_PARAGRAPH: string = "setPlayingParagraphAction";

function calcAttr(paragraph: ParagraphData) {
    const hasIndent = paragraph.hasIndent;
    let textAlign = "left";
    switch (paragraph.align) {
        case "left":
            textAlign = "left";
            break;
        case "center":
            textAlign = "center";
            break;
        case "right":
            textAlign = "end";
            break;
        default:
    }
    const coordinate = paragraph.coordinate;
    const posX = coordinate.posX;
    const posY = coordinate.posY;
    const fontSize = coordinate.fontSize;
    const cnFontSize = coordinate.cnFontSize == null ? fontSize : coordinate.cnFontSize;
    const showNewline = !!coordinate.showNewline;
    const cnShowNewline = coordinate.cnShowNewline == null ? showNewline : !!coordinate.cnShowNewline;
    const width = coordinate.width;
    const cnWidth = coordinate.cnWidth == null ? width : coordinate.cnWidth;
    return {
        hasIndent,
        textAlign,
        posX,
        posY,
        fontSize,
        cnFontSize,
        showNewline,
        cnShowNewline,
        width,
        cnWidth,
    };
}

export default Vue.extend({
    name: "Paragraph",
    props: {
        paragraph: {
            type: Object,
            default: {} as ParagraphData,
        },
        pronunciation: {
            type: String,
            default: "美音",
        },
        scale: {
            type: Number,
            default: 1,
        },
        showTranslate: {
            type: Boolean,
            default: false,
        },
        playingParagraph: {
            type: Number,
            default: -1,
        },
        playingSentence: {
            type: Number,
            default: -1,
        },
        itemIndex: {
            type: Number,
            default: -1,
        },
    } as DefaultProps,
    data() {
        const {
            hasIndent,
            textAlign,
            posX,
            posY,
            fontSize,
            cnFontSize,
            showNewline,
            cnShowNewline,
            width,
            cnWidth,
        } = calcAttr(this.paragraph);
        return {
            baseSize,
            playing: false,
            calcWidth: true,

            hasIndent,
            textAlign,
            posX,
            posY,

            fontSize,
            showNewline,
            width,

            cnFontSize,
            cnShowNewline,
            cnWidth,

            reading_mute_png,
            reading_playing_bg_png,
        };
    },
    watch: {
        playingParagraph(index: number) {
            this.playing = index === this.itemIndex;
        },
        showTranslate() {
            this.$nextTick(() => {
                this.setCalcWidth();
            });
        },
    },
    mounted() {
        this.setCalcWidth();
        const emitter = Singleton.get(Emitter);
        emitter.on(
            EnumSystem.SCREEN_RESIZE,
            () => {
                this.setCalcWidth();
            },
            this,
        );
    },
    beforeDestroy() {
        const emitter = Singleton.get(Emitter);
        emitter.offByTarget(this);
    },
    methods: {
        // 这个方法专门用于设置宽度，是及其不好的做法，但应需求有没有办法
        setCalcWidth() {
            if (!this.calcWidth) {
                return;
            }
            const bg: HTMLElement = this.$refs.bg as HTMLElement;
            const sentences: Array<HTMLElement> = this.$refs.sentences as Array<HTMLElement>;
            const content: HTMLElement = this.$refs.content as HTMLElement;
            content.style.maxWidth = "";
            let max = 0;
            let needCalc = false;
            sentences.forEach((value: HTMLElement, index: number) => {
                if (index === 0) {
                    const el: HTMLElement = value.children.item(0) as HTMLElement;
                    if (content.offsetHeight / value.offsetHeight > 1.5) {
                        needCalc = true;
                    }
                    if (el) {
                        if (value.offsetHeight / el.offsetHeight > 1.5) {
                            needCalc = true;
                        }
                    }
                }
                max = Math.max(value.offsetWidth, max);
            });
            if (needCalc && bg && max) {
                if (this.showTranslate) {
                    bg.style.width = "";
                } else {
                    const maxWidth = `calc(${max}px + 0.6em)`;
                    bg.style.width = maxWidth;
                    content.style.maxWidth = maxWidth;
                }
            } else {
                bg.style.width = "";
            }
        },
        onVoiceClick() {
            if (this.playingParagraph < 0 || !this.playing) {
                this.$emit(SET_PLAYING_PARAGRAPH, this.itemIndex);
            } else {
                this.$emit(SET_PLAYING_PARAGRAPH, -1);
            }
        },
        onWordClick(evt: Event, word: string, words: Array<WordData>) {
            const wordData: WordData = this.getKeyWordData(word, words) as WordData;
            if (wordData == null) {
                return;
            }
            this.$emit(SET_PLAYING_PARAGRAPH, -1);
            const target: HTMLSpanElement = evt.target as HTMLSpanElement;
            const cntext: string = wordData.cntext;
            const url: string = this.pronunciation === "美音" ? wordData.audioUrlUs : wordData.audioUrlUk;
            this.$emit("updateTipsDataAction", cntext, url, target);
        },
        getKeyWordData(word: string, words: Array<WordData>): WordData | void {
            const lower: string = word.toLowerCase();
            for (let i: number = 0; i < words.length; i += 1) {
                const value: WordData = words[i];
                if (value.entext.toLowerCase() === lower) {
                    return value;
                }
            }
            return;
        },
        getWordsVO(value: string): Array<string> {
            const textRegExp: RegExp = /\b.*?\b/gi;
            const splits: Array<string> = value.split(textRegExp);
            return splits;
        },
    },
});

interface WordVO {
    text: string;
    audio: string;
}
</script>
