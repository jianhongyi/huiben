<template>
    <div id="venus-container"></div>
</template>

<script lang="ts">
import Vue from "vue";
import StudyQuestions from "@/apis/study/questions/index";
import StudySubmit from "@/apis/study/submit/index";
import { EnumJourneyModule } from "../../enums/EnumJourneyModule";
import { completeApp } from "../../utils/shell";
import getTypeById from "./questionTypes";

export default Vue.extend({
    name: "Quiz",
    props: {
        id: {
            type: String,
            default: "",
            required: true,
        },
    },
    data() {
        return {
            venusInstance: (null as unknown) as IVenusInstance,
            result: [] as IVenusResult[],
        };
    },
    async mounted() {
        const res = await this.getQuestions();
        this.$emit("loading", false);
        if (res?.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const questions: { [x: string]: any }[] = Object.values(res.data.questions);
            const questionsLength = questions.length;
            const config: IVenusInitParams = {
                el: "#venus-container",
                questionList: questions,
                currentIndex: 0,
                commitType: "local",
                orientation: "landscape",
                review: false,
                onQuestionRender: index => {
                    const id: number = questions[index]?.content?.subContents[0]?.subContentTypeId;
                    this.$emit(
                        "update-progress",
                        [`${index + 1}/${questionsLength}`, `${getTypeById(id)}`],
                        (index + 1) / questionsLength,
                        id,
                        questions[index],
                    );
                },
                onResult: (result: IVenusResult) => {
                    this.saveResult(result);
                },
                onFinish: async () => {
                    const right: number = this.result.reduce((pre, cur) => {
                        return pre + (Object.values(cur)[0]?.master ? 1 : 0);
                    }, 0);
                    const result = await this.submit();
                    if (result == null || !result.success) {
                        this.$toast({ content: "提交失败，请重试" });
                        return;
                    }
                    completeApp({
                        message: `正确率：${right}/${questionsLength}`,
                        type: EnumJourneyModule.PRACTICE,
                    });
                },
            };
            this.venusInstance = new Venus(config);
        }
    },
    beforeDestroy() {
        if (this.venusInstance) {
            this.venusInstance.destroy();
        }
    },
    methods: {
        async getQuestions() {
            return StudyQuestions(this.id);
        },
        saveResult(result: IVenusResult) {
            this.result.push(result);
        },
        async submit() {
            return StudySubmit(this.id, EnumJourneyModule.PRACTICE, JSON.stringify({ result: this.result }));
        },
    },
});
</script>
<style lang="scss">
#venus-container {
    width: 100%;
    height: 100%;
    padding-top: 100px;
    overflow: scroll;
    box-sizing: border-box;
    background-color: #ffffff;

    * {
        font-family: readingjourneyChinese !important;
    }
}
</style>
