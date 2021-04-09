<template>
    <div v-show="show" v-cloak id="dialog-comp">
        <div class="dialog" :class="{ pt80: title == '' }">
            <div class="btns">
                <div v-if="subBtn" class="btn sub-btn" @click="onBtnClick(subBtn)">{{ subBtn.label || "取消" }}</div>
                <div v-if="mainBtn" class="btn main-btn" @click="onBtnClick(mainBtn)">{{
                    mainBtn.label || "确定"
                }}</div>
            </div>
            <p v-if="title !== ''" class="title">{{ title }}</p>
            <p class="content">{{ content }}</p>
            <div class="close" @click="onBtnClick(closeBtn)"></div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    name: "Dialog",
})
export default class Dialog extends Vue {
    show: boolean = false;
    title: string = "";
    content: string = "";

    subBtn: IDialogBtnParam | null = null;
    mainBtn: IDialogBtnParam | null = null;
    closeBtn: IDialogBtnParam | null = null;

    private hide(): void {
        this.show = false;
    }

    private onBtnClick(param: IDialogBtnParam | undefined): void {
        param?.action?.call(this);
        this.hide();
    }
}
</script>
<style lang="scss" scoped>
#dialog-comp {
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    user-select: none;

    .dialog {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 640px;
        padding-top: 40px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 11px 15px 0px rgba(30, 60, 48, 0.16);
        border-radius: 20px;
        overflow: hidden;
    }
    .pt80 {
        padding-top: 80px;
    }
    .close {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        background-image: url("~static/img/quiz/close.png");
        background-repeat: no-repeat;
        background-size: cover;
    }
    .close:active {
        transform: scale(0.9, 0.9);
    }
    .btns {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        position: absolute;
        bottom: 40px;
        width: 480px;
        left: 0;
        right: 0;
        height: 88px;
        margin: auto;
    }
    .btn {
        background: linear-gradient(90deg, rgba(102, 175, 255, 1) 0%, rgba(0, 122, 255, 1) 100%);
        box-shadow: 0px 6px 20px 0px rgba(0, 122, 255, 0.3);
        border-radius: 44px;
        font-size: 32px;
        color: rgba(255, 255, 255, 1);
        line-height: 88px;
        margin: auto;
        width: 100%;
        height: 100%;
    }
    .sub-btn {
        color: rgba(111, 111, 126, 1);
        margin-right: 48px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 20px 0px rgba(211, 215, 219, 0.3);
        border: 2px solid rgba(155, 155, 168, 1);
    }
    .btn:active {
        transform: scale(0.98, 0.98);
    }
    .title {
        height: 56px;
        font-size: 40px;
        font-weight: bold;
        color: rgba(5, 5, 7, 1);
        line-height: 56px;
        margin-bottom: 20px;
    }
    .content {
        width: 520px;
        margin: 0 auto;
        margin-bottom: 170px;
        font-size: 32px;
        color: rgba(5, 5, 7, 1);
        line-height: 44px;
    }
}
</style>
