<template>
    <div id="share-guide" @click="$emit('close-guide')">
        <div class="container">
            <img class="line-right" src="static/img/share/guide_line_right.png" alt />
            <img class="line-left" src="static/img/share/guide_line_left.png" alt />
            <img class="browser" src="static/img/share/guide_browser.png" alt />
            <img class="phone" src="static/img/share/guide_phone.png" alt />
            <p class="desc">请点击右上角 ···<br />选择在浏览器中打开</p>
        </div>
    </div>
</template>
<script>
export default {
    name: "ShareGuide",
};
</script>
<style lang="scss" scoped>
#share-guide {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;

    .container {
        position: absolute;
        top: 50px;
        right: 34px;
        width: 660px;
        height: 910px;

        * {
            position: absolute;
            z-index: 1;
        }
        .line-left {
            width: 157px;
            height: 279px;
            top: 157px;
            left: 0;
        }
        .line-right {
            width: 182px;
            height: 175px;
            top: 0;
            right: 0;
        }
        .browser {
            width: 232px;
            height: 232px;
            top: 446px;
            left: 75px;
            z-index: 2;
        }
        .phone {
            width: 295px;
            height: 612px;
            left: 184px;
            bottom: 0;
        }
        .desc {
            width: 252px;
            font-size: 28px;
            color: rgba(5, 5, 7, 1);
            line-height: 40px;
            top: 132px;
            right: 214px;
            text-align: center;
        }
    }
}
</style>
