<template>
    <div v-show="show" v-cloak id="toast-comp">
        <div class="toast">{{ content }}</div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";

@Component({
    name: "Toast",
})
export default class Toast extends Vue {
    show: boolean = false;
    content: string = "";
    timeout: number = 1500;

    private hide(): void {
        this.show = false;
    }

    @Watch("show")
    onShowChange(newVal: boolean, oldVal: boolean): void {
        if (!oldVal && newVal) {
            setTimeout(() => {
                this.hide();
            }, this.timeout);
        }
    }
}
</script>
<style lang="scss" scoped>
#toast-comp {
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    user-select: none;

    .toast {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 16px;
        font-size: 30px;
        line-height: 36px;
        color: rgba(255, 255, 255, 1);
        min-width: 350px;
        max-width: 500px;
        background: rgba(0, 0, 0, 0.75);
        border-radius: 8px;
    }
}
</style>
