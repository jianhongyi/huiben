<template>
    <div v-cloak id="app">
        <video
            id="video"
            playsinline="true"
            webkit-playsinline="true"
            x5-playsinline="true"
            controls
            preload="metadata"
            :src="data.videoUrl"
            :poster="data.coverUrl"
        ></video>
        <div class="content">
            <p class="title">{{ data.ename }}</p>
            <p class="desc">{{ data.cname }}</p>
            <ul class="labels _flexcenter">
                <li v-for="(l, $index) of data.labels" :key="$index" class="label">{{ l }}</li>
            </ul>
            <div class="result _flexcenter">
                <span>配音成绩</span>
                <ul class="stars _flexcenter">
                    <li
                        v-for="(n, $index) in fullStars"
                        :key="$index"
                        class="star"
                        :class="{ star_light: $index < data.star }"
                    ></li>
                </ul>
                <span class="time">{{ time }}</span>
            </div>
            <div class="me _flexcenter">
                <img
                    class="avatar"
                    :src="avatarRegexp.test(data.avatarUrl) ? data.avatarUrl : 'static/img/share/avatar_default.png'"
                />
                <div class="dialog arrow_box">
                    <p class="_abscenter">我正在使用悠游分级阅读 App 学习英文绘本，快来看看我的作品吧~</p>
                </div>
            </div>
        </div>
        <div class="footer _flexcenter">
            <img src="static/img/share/logo_FLTRP.png" />
            <p>如已安装“悠游分级阅读”App，可直接打开</p>
            <div class="btn" @click="openApp">
                <p>我也要配音</p>
            </div>
        </div>
        <ShareGuide v-show="showGuide" @close-guide="showGuide = false" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import qs from "qs";
import Shared from "@/apis/shared/index";
import openApp from "@/utils/openapp";
import ShareGuide from "./ShareGuide.vue";
import { isWechat } from "../../utils/shell";
import { Singleton } from "../../toolkit/base/Singleton";
import { Emitter } from "../../toolkit/base/Emitter";
import { EnumSystem } from "../../enums/EnumSystem";

export default Vue.extend({
    name: "ShareApp",
    components: { ShareGuide },
    data() {
        return {
            data: {} as ISharedData,
            fullStars: 5,
            showGuide: false,
            // eslint-disable-next-line no-useless-escape
            avatarRegexp: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
            context: Singleton.get(Emitter),
            isPlaying: false,
        };
    },
    computed: {
        id(): string {
            const sp = qs.parse(location.search, { ignoreQueryPrefix: true });
            return sp.id as string;
        },
        time(): string {
            if (!this.data?.ct) return "";
            const date = new Date(this.data?.ct);
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${
                date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
            }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
        },
    },
    async created() {
        const res = await Shared(this.id);
        this.data = res?.data || {};
    },
    mounted() {
        const video: HTMLVideoElement = document.getElementById("video") as HTMLVideoElement;
        if (video) {
            this.initVideoEvents(video);
            // 切换到后台后 暂停视频
            this.context.on(
                EnumSystem.SYSTEM_PAUSE,
                () => {
                    video.pause();
                },
                this,
            );
        }
    },
    methods: {
        // 打开 APP，如果在微信里引导到浏览器，如果在浏览器里定向到商店
        openApp(): void {
            if (isWechat) {
                this.showGuide = true;
                return;
            }
            openApp();
        },
        // 监听 video 事件
        initVideoEvents(video: HTMLVideoElement) {
            video.addEventListener("pause", () => {
                this.isPlaying = false;
            });
            video.addEventListener("play", () => {
                this.isPlaying = true;
            });
            video.addEventListener("ended", () => {
                this.isPlaying = false;
            });
        },
    },
});

// 分享接口返回的参数
interface ISharedData {
    ct: number;
    coverUrl: string;
    videoUrl: string;
    ename: string;
    cname: string;
    labels: string[];
    star: number;
    avatarUrl: string;
}
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
}
* {
    box-sizing: border-box;
}

#video {
    display: block;
    width: 100%;
    height: 428px;
}
.content {
    margin: auto;
    margin-top: 30px;
    width: 685px;
    color: rgba(111, 111, 126, 1);

    .title {
        height: 56px;
        font-size: 40px;
        font-weight: 500;
        color: rgba(5, 5, 7, 1);
        line-height: 56px;
        margin-bottom: 8px;
    }
    .desc {
        width: 100%;
        height: 32px;
        font-size: 24px;
        font-weight: 400;
        line-height: 32px;
        margin-bottom: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .labels {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        margin-bottom: 16px;
    }
    .label {
        height: 34px;
        border-radius: 4px;
        border: 2px solid rgba(155, 155, 168, 1);
        margin-right: 8px;
        padding: 2px 8px;
        font-size: 20px;
        line-height: 32px;
    }
    .result {
        flex-direction: row;
        padding-bottom: 30px;
        border-bottom: 1px solid rgba(235, 240, 245, 1);

        span {
            height: 32px;
            font-size: 24px;
            font-weight: 400;
            color: rgba(111, 111, 126, 1);
            line-height: 32px;
        }
        .stars {
            flex-direction: row;
            margin-left: 20px;

            .star {
                display: block;
                width: 24px;
                height: 24px;
                background-image: url("~static/img/share/share_star.png");
                background-size: cover;
                background-repeat: no-repeat;
                margin-right: 4px;
                filter: grayscale(1);
            }
            .star_light {
                filter: grayscale(0) !important;
            }
        }
        .time {
            margin-left: auto;
        }
    }

    .me {
        flex-direction: row;
        margin-top: 20px;

        .avatar {
            display: block;
            width: 120px;
            height: 120px;
            background: rgba(216, 216, 216, 1);
            border-radius: 60px;
        }
        .dialog {
            position: relative;
            width: 540px;
            height: 136px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 12px 24px 0px rgba(188, 198, 209, 0.2);
            border: 1px solid rgba(245, 245, 248, 1);
            border-radius: 20px;
            p {
                width: 480px;
                height: 88px;
                font-size: 28px;
                font-weight: 400;
                color: rgba(111, 111, 126, 1);
                line-height: 44px;
            }
        }
    }
}

.footer {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
    flex-direction: column;
    height: 255px;

    img {
        display: block;
        width: 280px;
        height: 68px;
    }
    p {
        text-align: center;
        height: 32px;
        font-size: 24px;
        font-weight: 400;
        color: rgba(188, 198, 209, 1);
        line-height: 32px;
    }
    .btn {
        width: 686px;
        height: 96px;
        background: linear-gradient(90deg, rgba(102, 175, 255, 1) 0%, rgba(0, 122, 255, 1) 100%);
        box-shadow: 0px 6px 20px 0px rgba(203, 228, 255, 0.3);
        border-radius: 48px;

        p {
            height: 45px;
            font-size: 32px;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 96px;
        }
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

.arrow_box {
    position: relative;
    background: #fff;
    border: 4px solid #fff;
}
.arrow_box:after,
.arrow_box:before {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.arrow_box:after {
    border-color: rgba(255, 255, 255, 0);
    border-right-color: #fff;
    border-width: 10px;
    margin-top: -10px;
}
.arrow_box:before {
    border-color: rgba(255, 255, 255, 0);
    border-right-color: #fff;
    border-width: 16px;
    margin-top: -16px;
}
</style>
