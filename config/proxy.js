module.exports = {
    "/": {
        target:
            !process.env.BUILD_STAGE === "development"
                ? "https://api.rj.unischool.cn/"
                : "https://fltrpreading.17zuoye.com/",
        changeOrigin: true,
    },
};
