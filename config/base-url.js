"use strict";
const chalk = require("chalk");

const stageList = ["development", "test", "staging", "production"];
const stage = process.env.BUILD_STAGE || "production";

const baseUrl = {
    development: "https://fltrpreading.17zuoye.com/",
    test: "https://fltrpreading.17zuoye.com/",
    staging: "https://api.rj.unischool.cn/",
    production: "https://api.rj.unischool.cn/",
}[stage];

console.log(chalk.yellow(`BUILD_STAGE: ${stage}`));

if (!stageList.includes(stage)) throw Error("Stage must be one of development/test/staging/production");

module.exports = { baseUrl, stage };
