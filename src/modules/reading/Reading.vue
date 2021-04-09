<template>
    <div class="reading" @mousedown="_onAudioAvailabled" @touchstart="_onAudioAvailabled">
        <div
            class="content"
            @mousedown="_onTouchStart"
            @mouseup="_onTouchEnd"
            @touchstart="_onTouchStart"
            @touchend="_onTouchEnd"
        >
            <Book
                :picture-datas="pictureDatas"
                :screen-mode="screenMode"
                :current-page="currentPage"
                @updatePictureAction="updatePictureAction"
            ></Book>
            <div id="paragraps" class="paragraps" :style="{ display: showParagraphs ? 'block' : 'none' }">
                <Paragraph
                    v-for="(item, index) in paragraphs"
                    :key="_getParagraphKey(item) + '_' + index"
                    :item-index="index"
                    :paragraph="item"
                    :pronunciation="pronunciation"
                    :scale="scale"
                    :show-translate="showTranslate"
                    :playing-paragraph="playingParagraph"
                    :playing-sentence="playingSentence"
                    @setPlayingParagraphAction="setPlayingParagraphAction"
                    @updateTipsDataAction="updateTipsDataAction"
                ></Paragraph>
            </div>
            <div id="points" class="points" :style="{ display: showInteractAreas ? 'block' : 'none' }">
                <InteractArea
                    v-for="(item, index) in interactAreas"
                    :key="index"
                    :interact-area="item"
                    :pronunciation="pronunciation"
                    :scale="scale"
                    @setPlayingParagraphAction="setPlayingParagraphAction"
                    @playFloatTextAudioAction="playFloatTextAudioAction"
                ></InteractArea>
            </div>
        </div>
        <div class="mask" :style="{ display: showThumbnail ? 'block' : 'none' }" @click="hideThumbnailAction"></div>
        <div
            class="thumbnails"
            :style="{
                bottom: showThumbnail ? '0' : null,
            }"
        >
            <div class="wrapper">
                <ul id="preview_content" class="content">
                    <li v-for="(item, index) in thumbnails" :key="index">
                        <div
                            class="container"
                            @click="
                                setCurrentPageAction(index);
                                hideThumbnailAction();
                            "
                        >
                            <img class="picture" :src="item" />
                            <div :class="'picture_bg ' + (currentPage === index ? 'selected' : 'unselected')"></div>
                            <div class="index">
                                <img class="bg" :src="reading_playing_bg_png" />
                                <div class="number">{{ index + 1 }}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <img
                class="button"
                :src="showThumbnail ? reading_preview_s_png : reading_preview_png"
                @click="showThumbnail ? hideThumbnailAction() : showThumbnailAction()"
            />
            <div class="page_number">
                <div class="current">{{ currentPage + 1 }}</div>
                <span class="total">/ {{ contents.length }}</span>
            </div>
        </div>
        <div class="buttons">
            <img v-if="previewMode" class="button" :src="reading_skip_png" />
            <img
                class="button"
                :src="showTranslate ? reading_translate_s_png : reading_translate_png"
                @click="showTranslateSwitchAction"
            />
            <img
                class="button"
                :src="autoplay ? reading_autoplay_s_png : reading_autoplay_png"
                @click="autoplaySwitchAction"
            />
        </div>
        <img class="back_btn" :src="btn_back_png" @click="backAction" />

        <div
            class="tips"
            :style="{ display: tipsData.show ? 'block' : 'none', top: tipsData.top, left: tipsData.left }"
        >
            <div>{{ tipsData.text }}</div>
        </div>
        <div v-show="showGuide" class="guide" @mouseup="_hideGuideHandler" @touchend="_hideGuideHandler">
            <div class="mask"></div>
            <div class="text">左右滑动来翻页吧</div>
            <img class="hand" :src="guide_hand_png" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.reading {
    background-color: #fff;
    user-select: none;
    left: 0;
    top: 0;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .content {
        width: 100%;
        height: 100%;
        .paragraps {
            position: absolute;
            pointer-events: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .points {
            position: absolute;
            pointer-events: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .back_btn {
        position: absolute;
        width: 1.2em;
        height: 1.2em;
        left: 0.1em;
        top: 0.1em;
    }
    .back_btn:active {
        transform: scale(0.9, 0.9);
    }

    .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
    }
    .thumbnails {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 4em;
        left: 0;
        bottom: -2.6em;
        transition-duration: 100ms;
        transition-property: bottom;

        .wrapper {
            pointer-events: auto;
            position: absolute;
            width: 100%;
            height: 2.6em;
            background-color: #fff;
            top: 1.4em;
            .content {
                position: absolute;
                width: auto;
                white-space: nowrap;
                li {
                    position: relative;
                    display: inline-block;
                    .container {
                        position: relative;
                        width: 3.3em;
                        height: 2.3em;
                        margin: 0.05em;
                        .index {
                            position: absolute;
                            left: 0;
                            top: 0;
                            .bg {
                                width: 1em;
                                height: 1em;
                            }
                            .number {
                                position: absolute;
                                left: 50%;
                                top: 45%;
                                transform: translate(-50%, -50%);
                                font-size: 0.36em;
                                font-weight: bold;
                                color: #fff;
                            }
                        }
                        .picture {
                            position: absolute;
                            left: 0.15em;
                            top: 0.15em;
                            width: 3em;
                            height: 2em;
                            object-fit: contain;
                        }
                        .picture_bg {
                            position: absolute;
                            left: 0.15em;
                            top: 0.15em;
                            width: 3em;
                            height: 2em;
                            border-radius: 0.2em;
                            border: 0.05em solid;
                            background-color: transparent;
                            &.unselected {
                                border-color: #eeeeee;
                            }
                            &.selected {
                                border-color: #00bcff;
                            }
                        }
                    }
                }
            }
        }
        .button {
            pointer-events: auto;
            position: absolute;
            top: 0.2em;
            left: 0.5em;
            width: 0.95em;
            height: 1em;
        }
        .button:active {
            transform: scale(0.9, 0.9);
        }
        .page_number {
            line-height: 0.5em;
            position: absolute;
            top: 0.5em;
            right: 0.2em;
            .current {
                display: inline-block;
                position: relative;
                font-size: 0.4em;
                font-weight: bold;
                color: #00bcff;
            }
            .total {
                position: relative;
                font-size: 0.28em;
                font-weight: bold;
            }
        }
    }
    .buttons {
        position: absolute;
        right: 0.1em;
        top: 0.1em;
        .button {
            width: 1em;
            height: 1em;
        }
        .button:active {
            transform: scale(0.9, 0.9);
        }
    }
    .tips {
        position: fixed;
        font-size: 0.26em;
        border-radius: 0.2em;
        color: #ffffff;
        background-color: #4a4a50;
        padding: 0.4em;
        left: 0;
        top: 0;
        transform: translate(-50%, -100%);
    }
    .guide {
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.5;
        }
        .text {
            position: absolute;
            color: #ffffff;
            font-size: 0.5em;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 40%;
        }
        .hand {
            position: absolute;
            width: 1.89em;
            height: 2.17em;
            transform: translate(-50%, -50%);
            left: 40%;
            top: 50%;
            animation: step 2s infinite;
            @keyframes step {
                0% {
                    left: 40%;
                }
                50% {
                    left: 60%;
                }
                100% {
                    left: 40%;
                }
            }
        }
    }
}
</style>

<script lang="ts">
import Vue from "vue";
import Book, { PictureData } from "@/modules/reading/Book.vue";
import BScroll from "better-scroll";
import { baseSize } from "@/utils/screen";
import Paragraph from "./Paragraph.vue";
import InteractArea from "./InteractArea.vue";
import { ParagraphData, SentenceData, InteractAreaData, ContentData } from "@/types/TypesReading";
import { exitApp } from "@/utils/shell";
import { audio } from "@/utils/audio";

import btn_back_png from "static/img/common/btn_back.png";
import reading_skip_png from "static/img/reading/reading_skip.png";
import reading_preview_png from "static/img/reading/reading_preview.png";
import reading_preview_s_png from "static/img/reading/reading_preview_s.png";
import reading_playing_bg_png from "static/img/reading/reading_playing_bg.png";
import reading_translate_s_png from "static/img/reading/reading_translate_s.png";
import reading_translate_png from "static/img/reading/reading_translate.png";
import reading_autoplay_s_png from "static/img/reading/reading_autoplay_s.png";
import reading_autoplay_png from "static/img/reading/reading_autoplay.png";
import guide_hand_png from "static/img/common/guide_hand.png";
import { EnumSystem } from "../../enums/EnumSystem";
import { Emitter } from "../../toolkit//base/Emitter";
import { PropValidator } from "vue/types/options";

const defaultStartX: number = -1000;
function getValidNumber(cur: number, min: number, max: number): number {
    if (cur < min) {
        return min;
    } else if (cur > max) {
        return max;
    } else {
        return cur;
    }
}

interface DefaultProps {
    contents: PropValidator<Array<ContentData>>;
    pronunciation: PropValidator<string>;
    screenMode: PropValidator<string>;
    audioUnlocked: PropValidator<boolean>;
    context: PropValidator<Emitter>;
}

export default Vue.extend({
    name: "Reading",
    components: {
        Book,
        Paragraph,
        InteractArea,
    },
    props: {
        contents: {
            type: Array,
            default: [] as Array<ContentData>,
        },
        pronunciation: {
            type: String,
            default: "美音" /** 发音： 美音 | 英音 */,
        },
        screenMode: {
            type: String,
            default: "landscape" /** 横竖屏： "vertical" | "landscape" */,
        },
        audioUnlocked: {
            type: Boolean,
            default: false,
        },
        context: {
            type: Object,
            default: {} as Emitter,
        },
    } as DefaultProps,
    data() {
        interface UserData {
            bScroll?: BScroll;
            playingUrl?: string;
            playingUrlList?: Array<string>;
        }
        const userData: UserData = {};
        return {
            /** 声音是否被允许 */
            audioAvailabled: this.audioUnlocked,
            /** 预览模式 */
            previewMode: false,
            /** 是否自动播放中 */
            autoplay: false,
            /** 是否显示引导 */
            showGuide: !this.audioUnlocked,
            /** 是否显示中文翻译 */
            showTranslate: false,
            /** 是否显示缩略图 */
            showThumbnail: false,
            /** 当前页 */
            currentPage: 0,
            /** 段落数据 */
            paragraphs: [] as Array<ParagraphData>,
            /** 是否显示段落 */
            showParagraphs: true,
            /** 热区数据 */
            interactAreas: [] as Array<InteractAreaData>,
            /** 是否显示热区 */
            showInteractAreas: true,
            /** 记录触摸起始点 */
            startX: defaultStartX,
            /** 当前页面缩放值 */
            scale: 1,
            /** 用户数据 */
            userData,
            /** 当前播放的段落 */
            playingParagraph: -1,
            /** 当前播放的句子 */
            playingSentence: -1,
            /** 阅读开始时间点 */
            startTime: -1,
            /** tips信息 */
            tipsData: {
                text: "",
                show: false,
                left: "0",
                top: "0",
                timeID: -1,
            },
            btn_back_png,
            reading_skip_png,
            reading_preview_png,
            reading_preview_s_png,
            reading_playing_bg_png,
            reading_translate_s_png,
            reading_translate_png,
            reading_autoplay_s_png,
            reading_autoplay_png,
            guide_hand_png,
        };
    },
    computed: {
        pictureDatas(): Array<PictureData> {
            return (this.contents as Array<ContentData>).map((value: ContentData) => {
                return {
                    url: value.pictureUrl,
                    width: -1,
                    height: -1,
                    scale: 1,
                };
            });
        },
        thumbnails(): Array<string> {
            return (this.contents as Array<ContentData>).map((value: ContentData) => {
                return value.pictureThumbnailUrl;
            });
        },
    },
    mounted() {
        const wrapper: HTMLDivElement = this.$el.querySelector(".wrapper") as HTMLDivElement;
        const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        const bScroll: BScroll = new BScroll(wrapper, {
            scrollX: true,
            scrollY: false,
            click: true,
            useTransition: !isIOS,
        });
        this.userData.bScroll = bScroll;
        this.startTime = Date.now();
        const context = this.context;
        context.on(
            EnumSystem.SYSTEM_PAUSE,
            () => {
                this.stopAudioSingle();
                this.setPlayingParagraphAction(-1);
            },
            this,
        );
    },
    methods: {
        _getParagraphKey(value: ParagraphData) {
            const paragraphs = this.contents[this.currentPage].paragraphs;
            let index = -1;
            for (let i = 0; i < paragraphs.length; i += 1) {
                const paragraph = paragraphs[i];
                if (paragraph === value) {
                    index = this.currentPage;
                    break;
                }
            }
            return index;
        },
        _onAudioAvailabled() {
            if (this.audioAvailabled) {
                return;
            }
            this.audioAvailabled = true;
        },
        _hideGuideHandler() {
            if (!this.showGuide) {
                return;
            }
            this.showGuide = false;
            if (this.audioAvailabled) {
                this.$nextTick(() => {
                    this.setPlayingParagraphAction(0);
                });
            }
        },
        _scrollToCurrent() {
            const cur: number = this.currentPage;
            const length: number = this.contents.length;
            const bScroll: BScroll = this.userData.bScroll as BScroll;
            const previewContent: HTMLElement = this.$el.querySelector("#preview_content") as HTMLElement;
            bScroll.scrollTo((-previewContent.offsetWidth / length) * cur, 0);
        },
        _onTouchStart(evt: MouseEvent | TouchEvent) {
            const clientX: number = (evt as MouseEvent).clientX || (evt as TouchEvent).changedTouches[0].clientX;
            this.startX = clientX;
            this.autoplay = false;
        },
        _onTouchEnd(evt: MouseEvent | TouchEvent) {
            if (this.startX < 0) {
                return;
            }
            const clientX: number = (evt as MouseEvent).clientX || (evt as TouchEvent).changedTouches[0].clientX;
            const startX: number = this.startX;
            if (clientX - 50 > startX) {
                this.setCurrentPageAction(this.currentPage - 1);
            } else if (startX - 50 > clientX) {
                this.setCurrentPageAction(this.currentPage + 1);
            }
            this.startX = defaultStartX;
        },
        playAudioSingle(url: string, onEnded?: Function): void {
            if (this.userData.playingUrl == url) {
                return;
            }
            this.stopAudioSingle();
            this.userData.playingUrl = url;
            audio.playAudio(url, () => {
                this.userData.playingUrl = undefined;
                if (onEnded != null) {
                    onEnded();
                }
            });
        },
        stopAudioSingle(): void {
            const playingUrl: string | undefined = this.userData.playingUrl;
            this.userData.playingUrl = undefined;
            if (playingUrl == null) {
                return;
            }
            audio.stopAudio(playingUrl);
        },
        /** 播放文本动作 */
        playFloatTextAudioAction(url: string) {
            this.setPlayingParagraphAction(-1);
            this.autoplay = false;
            this.playAudioSingle(url);
        },
        /** 更新图片动作 */
        updatePictureAction(index: number) {
            if (this.currentPage !== index) {
                return;
            }
            const item: PictureData = this.pictureDatas[this.currentPage];
            if (item == null || item.width < 0 || item.height < 0) {
                return;
            }
            const paragraps: HTMLDivElement = this.$el.querySelector("#paragraps") as HTMLDivElement;
            paragraps.style.width = item.width / baseSize + "em";
            paragraps.style.height = item.height / baseSize + "em";
            const points: HTMLDivElement = this.$el.querySelector("#points") as HTMLDivElement;
            points.style.width = item.width / baseSize + "em";
            points.style.height = item.height / baseSize + "em";
            this.paragraphs = this.contents[this.currentPage].paragraphs;
            this.interactAreas = this.contents[this.currentPage].interactAreas;
            this.scale = item.scale;
            if (this.audioAvailabled) {
                this.$nextTick(() => {
                    this.setPlayingParagraphAction(0);
                });
            }
        },
        /** 更新tips信息 */
        updateTipsDataAction(text: string, url: string, element: HTMLElement) {
            const rect: DOMRect = element.getBoundingClientRect();
            this.tipsData.text = text;
            this.tipsData.left = rect.left + rect.width / 2 + "px";
            this.tipsData.top = rect.top + "px";
            this.tipsData.show = true;
            this.playAudioSingle(url);
            if (this.tipsData != null && this.tipsData.timeID != null) {
                clearTimeout(this.tipsData.timeID);
            }
            this.tipsData.timeID = window.setTimeout(() => {
                if (this.tipsData != null) {
                    this.tipsData.show = false;
                }
            }, 1000);
        },
        /** 设置当前页动作 */
        setCurrentPageAction(value: number) {
            if (value > this.contents.length - 1) {
                this.completeAction();
                return;
            }
            const validNumber: number = getValidNumber(value, 0, this.contents.length - 1);
            if (this.currentPage === validNumber) {
                return;
            }
            this.currentPage = validNumber;
            this.setPlayingParagraphAction(-1);
            const item: PictureData = this.pictureDatas[this.currentPage];
            if (item.width >= 0 && item.height >= 0) {
                this.updatePictureAction(this.currentPage);
            }
        },
        /** 返回动作 */
        backAction() {
            this.autoplay = false;
            this.setPlayingParagraphAction(-1);
            this.$dialog({
                content: "退出后不保存阅读进度，是否退出?",
                mainBtn: {
                    action() {
                        exitApp();
                    },
                },
                subBtn: {},
            });
        },
        /** 结束动作 */
        completeAction() {
            this.autoplay = false;
            this.setPlayingParagraphAction(-1);
            this.$dialog({
                content: "是否结束阅读?",
                mainBtn: {
                    action: () => {
                        const curTime: number = Date.now();
                        const readingTime: number = curTime === -1 ? 0 : curTime - this.startTime;
                        this.$emit("completeApp", readingTime);
                    },
                },
                subBtn: {},
            });
        },
        /** 翻译切换动作 */
        showTranslateSwitchAction() {
            this.showTranslate = !this.showTranslate;
        },
        /** 自动播放切换动作 */
        autoplaySwitchAction() {
            this.autoplay = !this.autoplay;
            if (this.playingParagraph === -1 && this.autoplay) {
                this.setPlayingParagraphAction(0);
            }
        },
        /** 缩略图显示动作 */
        showThumbnailAction() {
            this.autoplay = false;
            this.showThumbnail = true;
            this._scrollToCurrent();
        },
        /** 缩略图隐藏动作 */
        hideThumbnailAction() {
            this.showThumbnail = false;
        },
        /** 设置当前播放的段落 */
        setPlayingParagraphAction(index: number) {
            if (index == null || index < 0) {
                this.playingParagraph = -1;
                this.playingSentence = -1;
                this.showInteractAreas = true;
                this.userData.playingUrlList = undefined;
                this.stopAudioSingle();
                return;
            }
            const contentData: ContentData = this.contents[this.currentPage] as ContentData;
            if (contentData == null) {
                return;
            }
            const paragrapData: ParagraphData = contentData.paragraphs[index];
            if (paragrapData == null) {
                return;
            }
            this.playingParagraph = index;
            this.playingSentence = 0;
            this.showInteractAreas = false;

            this.userData.playingUrlList = paragrapData.sentences.map((data: SentenceData) => {
                return data.audioUrl;
            });
            const length: number = this.userData.playingUrlList.length;

            const playQueue = () => {
                const audioUrlList: Array<string> = this.userData.playingUrlList as Array<string>;
                if (audioUrlList == null) {
                    return;
                }
                if (audioUrlList.length > 0) {
                    this.playingSentence = length - audioUrlList.length;
                    const url: string = audioUrlList.shift() as string;
                    this.playAudioSingle(url, playQueue);
                } else {
                    this.userData.playingUrlList = undefined;
                    const nextParagraph: number = this.playingParagraph + 1;
                    if (nextParagraph < contentData.paragraphs.length) {
                        this.setPlayingParagraphAction(nextParagraph);
                    } else {
                        if (this.autoplay) {
                            const nextPage: number = this.currentPage + 1;
                            if (nextPage < this.contents.length) {
                                this.setCurrentPageAction(nextPage);
                            } else {
                                this.setPlayingParagraphAction(-1);
                                this.completeAction();
                            }
                        } else {
                            this.setPlayingParagraphAction(-1);
                        }
                    }
                }
            };
            playQueue();
        },
    },
});
</script>
