import ReadingApp from "@/modules/reading/ReadingApp.vue";
import Vue from "vue";
import "./_base";

document.addEventListener("touchmove", (evt: Event) => {
    evt.preventDefault();
});

new Vue({
    el: "#app",
    render: h => h(ReadingApp),
});
