<template>
    <div v-cloak id="app">
        <div v-if="!showActivated" class="activate">
            <h3>验证激活码</h3>
            <div class="info">
                <img src="static/img/activate/ic_global_active_info.png" alt />
                <p>刮开教材背面的涂层即可获得激活码，1 个激活码只能被验证 1 次</p>
            </div>
            <div class="code">
                <p>激活码</p>
                <input v-model.trim="code" type="text" placeholder="请输入激活码" />
            </div>
            <div class="btn" :class="{ disable: code === '' }" @click="activate">
                <p>立即验证</p>
            </div>
        </div>
        <Activated v-else :cover="cover" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Activate from "@/apis/activation/activate";
import Activated from "./Activated.vue";

export default Vue.extend({
    name: "ActivateApp",
    components: {
        Activated,
    },
    data() {
        return {
            code: "",
            cover: undefined,
            showActivated: false,
        };
    },
    methods: {
        async activate() {
            if (this.code === "") return;
            const res = await Activate(this.code);
            if (res?.success) {
                this.$toast({
                    content: "教材激活成功，请下载悠游分级阅读app使用",
                });
                setTimeout(() => {
                    this.cover = res.data.product.coverUrl;
                    this.showActivated = true;
                }, 2000);
            } else {
                this.$toast({
                    content: res?.info || "",
                });
            }
        },
    },
});
</script>

<style lang="scss">
html,
body,
#app {
    width: 100%;
    height: 100%;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;
    background: rgba(255, 255, 255, 1);
    padding: 80px;
}
* {
    box-sizing: border-box;
}

h3 {
    height: 68px;
    font-size: 48px;
    color: rgba(5, 5, 7, 1);
    line-height: 68px;
    margin-bottom: 20px;
}
.info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
    margin-bottom: 80px;
    img {
        display: block;
        width: 32px;
        height: 32px;
        margin-top: 8px;
        margin-right: 16px;
    }

    p {
        flex: 1;
        font-size: 28px;
        font-weight: 400;
        color: rgba(65, 65, 72, 1);
        line-height: 44px;
    }
}
.code {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 112px;
    border-bottom: 1px solid #ebf0f5;
    margin-bottom: 80px;

    p {
        height: 45px;
        font-size: 32px;
        color: rgba(5, 5, 7, 1);
        line-height: 45px;
        margin-right: 32px;
    }
    input {
        height: 44px;
        border: none;
        font-size: 32px;
        line-height: 44px;
        color: #050507;
        &:focus {
            outline: none;
        }
    }
    ::-webkit-input-placeholder {
        font-size: 32px;
        color: rgba(188, 198, 209, 1);
        line-height: 44px;
    }
}
.btn {
    width: 590px;
    height: 96px;
    background: linear-gradient(90deg, rgba(102, 175, 255, 1) 0%, rgba(0, 122, 255, 1) 100%);
    box-shadow: 0px 6px 20px 0px rgba(203, 228, 255, 0.3);
    border-radius: 48px;
    text-align: center;
    &.disable {
        background: #cce3fe;
    }
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
