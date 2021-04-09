<template>
    <div id="app">
        <Reading
            :contents="contents"
            :pronunciation="pronunciation"
            :screen-mode="screenMode"
            :context="context"
            :audio-unlocked="audioUnlocked"
            @completeApp="completeApp"
        ></Reading>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Reading from "@/modules/reading/Reading.vue";
import StudySubmit from "@/apis/study/submit/index";
import Obtain from "@/apis/study/obtain/index";
import { setDesignPixel } from "@/utils/screen";
import { completeApp, isShell } from "@/utils/shell";
import { EnumJourneyModule } from "@/enums/EnumJourneyModule";
import { ContentData, WordData } from "@/types/TypesReading";
import { Singleton } from "../../toolkit/base/Singleton";
import { Emitter } from "../../toolkit/base/Emitter";

export default Vue.extend({
    name: "ReadingApp",
    components: {
        Reading,
    },
    data() {
        let audioUnlocked: boolean = false;
        if (isShell) {
            const guideKey: string = "_guide_count_";
            const countString: string | null = window.localStorage.getItem(guideKey);
            if (countString != null) {
                const count: number = parseInt(countString, 10);
                if (count > 0) {
                    window.localStorage.setItem(guideKey, (count - 1).toString());
                } else {
                    audioUnlocked = true;
                }
            } else {
                window.localStorage.setItem(guideKey, (2).toString());
            }
        }
        return {
            picturebookId: "",
            contents: [] as Array<ContentData>,
            pronunciation: "美音",
            screenMode: "landscape",
            context: Singleton.get(Emitter),
            audioUnlocked,
        };
    },

    async mounted(): Promise<void> {
        setDesignPixel(undefined, 1334, 750);
        const search: string = window.location.search.substring(1);
        const searchSplit: Array<string> = search.split("&");
        const searchMap: { [key: string]: string } = {};
        searchSplit.forEach((value: string) => {
            const splitValue: Array<string> = value.split("=");
            searchMap[splitValue[0]] = splitValue[1];
        });
        const picturebookId: string = searchMap["id"] || "PBP_10300001168212";
        const result: ObtainResult = await this.getObtain(picturebookId);
        const pictureBookData: PictureBookData = result.data.pictureBook;
        const screenMode: "vertical" | "landscape" = pictureBookData.screenMode;
        if (screenMode === "vertical") {
            setDesignPixel(this.$el as HTMLElement, 750, 1334);
        } else {
            setDesignPixel(this.$el as HTMLElement, 1334, 750);
        }
        if (screenMode === "vertical") {
            setDesignPixel(undefined, 750, 1334);
        } else {
            setDesignPixel(undefined, 1334, 750);
        }
        this.picturebookId = picturebookId;
        this.contents = pictureBookData.contents;
        this.screenMode = screenMode;
    },
    methods: {
        getObtain(picturebookId: string): Promise<ObtainResult> {
            return new Promise((resolve: Function) => {
                const send = async () => {
                    const result: ObtainResult | undefined = await Obtain(picturebookId);
                    if (result == null || !result.success) {
                        this.$dialog({
                            content: "网络错误，点击确定重新请求?",
                            mainBtn: {
                                action() {
                                    send();
                                },
                            },
                            closeBtn: {
                                action() {
                                    send();
                                },
                            },
                        });
                    } else {
                        resolve(result);
                    }
                };
                send();
            });
        },
        async completeApp(readingTime: number) {
            const result: StudySubmitData = (await StudySubmit(
                this.picturebookId,
                EnumJourneyModule.READING,
                JSON.stringify({ duration: readingTime / 1000 }),
            )) as StudySubmitData;
            if (result == null || !result.success) {
                return;
            }
            const wordsCount: number = result?.data?.extras?.wordsCount || 0;
            const formatDuration = (ms: number) => {
                if (ms < 0) ms = -ms;
                const time = {
                    天: Math.floor(ms / 86400000),
                    小时: Math.floor(ms / 3600000) % 24,
                    分钟: Math.floor(ms / 60000) % 60,
                    秒: Math.floor(ms / 1000) % 60,
                };
                return Object.entries(time)
                    .filter(val => val[1] !== 0)
                    .map(([key, val]) => `${val}${key}${val !== 1 ? "" : ""}`)
                    .join("");
            };
            const time: string = formatDuration(readingTime);
            const message: string = `用时${time}，阅读了${wordsCount}个单词`;
            const type: string = `READING`;
            completeApp({
                message,
                type,
            });
        },
    },
});

interface PictureBookData {
    authorized: boolean;
    cname: string;
    contents: Array<ContentData>;
    coverThumbnailUrl: string;
    coverUrl: string;
    ename: string;
    id: string;
    materialUrl: string;
    practiceQuestions: Array<string>;
    screenMode: "vertical" | "landscape";
    spellingPb: boolean;
    subjectId: number; // 101 === CHINESE ; 103 or others === ENGLISH
    wordList: Array<WordData>;
}

interface StudySubmitData {
    data: {
        submittedModule: string;
        nextModule: string;
        extras: {
            duration: number;
            wordsCount: number;
        };
    };
    success: boolean;
    sysTime: number;
}

interface ObtainResult {
    data: { pictureBook: PictureBookData };
    success: boolean;
    sysTime: number;
}
</script>
<style lang="scss">
* {
    -webkit-tap-highlight-color: transparent;
}
html,
body {
    background-color: #000;
    width: 100%;
    height: 100%;
}
#app {
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    touch-action: none;
    font-family: readingjourneyChinese;
}
</style>
