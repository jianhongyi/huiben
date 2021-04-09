<template>
    <div class="book">
        <div class="container">
            <div
                v-for="(item, index) in pictureDatas"
                :key="index"
                :class="'page' + ' ' + (index >= currentPage ? 'right' : 'left')"
                :style="{ zIndex: -index - 1 }"
            >
                <img
                    v-if="Math.abs(index - currentPage) < 3"
                    :class="'img' + ' ' + screenMode"
                    :src="item.url"
                    @load="onLoaded($event, item, index)"
                    @error="onError($event, item, index)"
                />
                <!-- <div class="index">{{ index + 1 }}</div> -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.book {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        perspective: 30em;
        transform-style: preserve-3d;
        .page {
            position: absolute;
            width: 100%;
            height: 100%;
            transition: 500ms;
            transform-origin: left;
            background-color: #ffffff;
            &.left {
                transform: translateZ(2px) rotateY(-90deg);
            }
            &.right {
                transform: translateZ(2px) rotateY(0deg);
            }

            .img {
                position: relative;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                &.vertical {
                    width: 7.5em;
                    height: 13.34em;
                }
                &.landscape {
                    width: 13.34em;
                    height: 7.5em;
                }
            }

            .index {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: red;
                opacity: 0.5;
            }
        }
    }
}
</style>

<script lang="ts">
import Vue from "vue";
import { baseSize } from "@/utils/screen";

export default Vue.extend({
    name: "Book",
    props: {
        pictureDatas: {
            type: Array,
            default: [] as Array<PictureData>,
        },
        screenMode: {
            type: String,
            default: "landscape" /** 横竖屏： "vertical" | "landscape" */,
        },
        currentPage: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        onLoaded(evt: Event, item: PictureData, index: number) {
            const img: HTMLImageElement = evt.target as HTMLImageElement;
            let width: number;
            let height: number;
            if (this.screenMode === "vertical") {
                width = 750;
                height = (img.naturalHeight / img.naturalWidth) * 750;
            } else {
                width = (img.naturalWidth / img.naturalHeight) * 750;
                height = 750;
            }
            img.style.width = width / baseSize + "em";
            img.style.height = height / baseSize + "em";
            item.width = width;
            item.height = height;
            item.scale = width / img.naturalWidth;
            this.$emit("updatePictureAction", index);
        },
        onError(evt: Event, item: string, index: number) {
            index;
            this.$dialog({
                content: "图片加载失败,是否重新加载?",
                mainBtn: {
                    action() {
                        const img: HTMLImageElement = evt.target as HTMLImageElement;
                        img.src = item;
                    },
                },
            });
        },
    },
});

export interface PictureData {
    url: string;
    width: number;
    height: number;
    scale: number;
}
</script>
