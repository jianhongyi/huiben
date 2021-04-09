import Vue from "vue";
import index from "@/modules/register/index.vue";
import "./_base";

new Vue({
    el: "#app",
    render: h => h(index),
});
