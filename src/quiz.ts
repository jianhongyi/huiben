import Vue from "vue";
import QuizApp from "@/modules/quiz/QuizApp.vue";
import "./_base";

new Vue({
    el: "#app",
    render: h => h(QuizApp),
});
