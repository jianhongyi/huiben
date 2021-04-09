import Vue from "vue";
import ShareApp from "@/modules/share/ShareApp.vue";
import "./_base";

new Vue({
    el: "#app",
    render: h => h(ShareApp),
});
