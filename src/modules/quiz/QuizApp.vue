<template>
    <div v-cloak id="app">
        <div class="header">
            <Back :handler="backHandler"></Back>
            <Progress :progress="progress">
                <template v-slot:number>{{ progressLabel }}</template>
                <template v-slot:type>{{ typeLabel }}</template>
            </Progress>
            <div v-show="showTip" class="lines-tip">
                <img class="tip_left_arrow" src="static/img/quiz/arrow_left.png" />
                <img class="tip_guide_hand" src="static/img/quiz/guide_hand.png" />
                <p>更多选项</p>
            </div>
        </div>
        <Quiz :id="id" @update-progress="updateProgress" @loading="r => (loading = r)"></Quiz>
        <Loading :loading="loading" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Loading from "@/components/Loading.vue";
import Quiz from "@/modules/quiz/Quiz.vue";
import Back from "@/components/Back.vue";
import Progress from "@/components/Progress.vue";
import qs from "qs";

export default Vue.extend({
    name: "QuizApp",
    components: {
        Quiz,
        Back,
        Progress,
        Loading,
    },
    data() {
        return {
            loading: true,
            progress: 0,
            progressLabel: "",
            typeLabel: "",
            showTip: false,
            startX: 0,
            endX: 0,
        };
    },
    computed: {
        id(): string {
            const sp = qs.parse(location.search, { ignoreQueryPrefix: true });
            return sp.id as string;
        },
    },
    methods: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateProgress(title: string[], progress: number, subcontentId: number, question?: { [x: string]: any }) {
            this.progressLabel = title[0];
            this.typeLabel = title[1];
            this.progress = progress;
            setTimeout(() => {
                // 连线题如果选项多于三个需要显示提示
                if ([7, 27].includes(subcontentId)) {
                    const linesOptionNum = question?.content?.subContents[0]?.answers.length;
                    if (linesOptionNum > 3) {
                        this.showLinesQuestionTip();
                    }
                }
            }, 200);
        },
        backHandler() {
            this.$dialog({
                content: `退出后不保存答题进度，是否退出？`,
                mainBtn: {
                    action: () => {
                        window?.do_external("disMissView");
                    },
                },
                subBtn: {},
            });
        },
        touchStartHandler(e: TouchEvent) {
            this.startX = e.changedTouches[0].screenX;
        },
        touchEndHandler(e: TouchEvent) {
            this.endX = e.changedTouches[0].screenX;
            if (this.startX - this.endX > 50) {
                this.showTip = false;
                document.removeEventListener("touchstart", this.touchStartHandler);
                document.removeEventListener("touchend", this.touchEndHandler);
            }
        },
        showLinesQuestionTip() {
            document.addEventListener("touchstart", this.touchStartHandler);
            document.addEventListener("touchend", this.touchEndHandler);
            this.showTip = true;
        },
    },
});
</script>
<style lang="scss">
.header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 30px;
    width: 100%;
    height: 100px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    box-sizing: border-box;

    #back-comp {
        margin-right: 30px;
    }

    .lines-tip {
        display: flex;
        align-items: flex-start;
        width: 230px;
        font-size: 28px;
        margin-left: auto;
        margin-right: 32px;

        .tip_left_arrow {
            display: block;
            width: 35px;
            height: 31px;
            margin-right: 65px;
        }
        .tip_guide_hand {
            position: absolute;
            top: 30px;
            right: 140px;
            display: block;
            width: 84px;
            height: 96px;
            animation: swipe 1s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in;
        }
        p {
            font-size: 30px;
            color: rgba(109, 108, 108, 1);
        }
    }
}
@keyframes swipe {
    0% {
        right: 140px;
    }
    100% {
        right: 200px;
    }
}
</style>
