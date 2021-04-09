<template>
    <div id="progress-comp">
        <span class="label">
            阅读理解
            <slot name="number"></slot>
        </span>
        <div class="bar">
            <span class="cur" :style="{ width: progress * 100 + '%' }"></span>
        </div>
        <span class="label">
            <slot name="type"></slot>
        </span>
    </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Progress",
    props: {
        progress: {
            type: Number,
            default: 0,
            validator: value => {
                return value >= 0 && value <= 1;
            },
        },
    },
});
</script>
<style lang="scss" scoped>
#progress-comp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 10px 0 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;

    .label {
        font-size: 28px;
        font-weight: bold;
        color: rgba(149, 153, 166, 1);
        line-height: 36px;
        margin-right: 20px;
    }
    .bar {
        width: 120px;
        height: 15px;
        background: rgba(255, 156, 0, 0.3);
        border-radius: 10px;
        margin-right: 20px;
    }
    .cur {
        display: block;
        width: 0;
        height: 100%;
        background: rgba(255, 156, 0, 1);
        border-radius: 10px;
        transition: width 0.3s;
    }
}
</style>
