<template>
    <div v-cloak class="activated">
        <img :src="cover" class="cover" />
        <div class="title">
            <img src="static/img/activate/ic_global_buy_success.png" alt />
            <p>您的线上学习资源已激活</p>
        </div>
        <div class="tip">
            <h3>学习资源使用方法：</h3>
            <p>请下载并安装“悠游分级阅读”app，使用您本次激活资源所用手机号登录app即可使用对应的学习资源。</p>
        </div>
        <div class="btn" @click="openApp">
            <p>下载 App</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import openApp from "@/utils/openapp";

export default Vue.extend({
    name: "ActivateApp",
    props: {
        cover: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showGuide: false,
        };
    },
    methods: {
        // 打开 APP，如果在微信里引导到浏览器，如果在浏览器里定向到商店
        openApp(): void {
            openApp();
        },
    },
});
</script>

<style lang="scss" scoped>
.activated {
    width: 100%;
    height: 100%;
    padding: 56px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
}
.cover {
    display: block;
    margin: auto;
    width: 300px;
    margin-bottom: 80px;
}
.title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-bottom: 40px;
    img {
        display: block;
        width: 60px;
        height: 60px;
        margin-right: 28px;
    }

    p {
        height: 56px;
        font-size: 40px;
        font-weight: bold;
        color: rgba(5, 5, 7, 1);
        line-height: 56px;
    }
}
.tip {
    display: flex;
    flex-direction: column;
    margin-bottom: 80px;
    h3 {
        height: 44px;
        font-size: 32px;
        font-weight: bold;
        color: rgba(5, 5, 7, 1);
        line-height: 44px;
        margin-bottom: 12px;
    }
    p {
        font-size: 28px;
        color: rgba(65, 65, 72, 1);
        line-height: 48px;
    }
}
.btn {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: auto;
    width: 590px;
    height: 96px;

    background: linear-gradient(90deg, rgba(102, 175, 255, 1) 0%, rgba(0, 122, 255, 1) 100%);
    box-shadow: 0px 6px 20px 0px rgba(203, 228, 255, 0.3);
    border-radius: 48px;
    text-align: center;

    p {
        font-size: 32px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 96px;
    }
}
._abscenter {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
._flexcenter {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
