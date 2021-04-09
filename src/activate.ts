import Vue from "vue";
import ActivateApp from "@/modules/activate/ActivateApp.vue";
import "./_base";

new Vue({
    el: "#app",
    render: h => h(ActivateApp),
});
