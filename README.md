# 悠游绘本项目Web前端仓库

## 技术栈
项目采用 Vue + TypeScript 开发，主要依赖如下：

- [vuejs](https://cn.vuejs.org/)
- [typescript](https://www.typescriptlang.org/docs/home.html)
- [vue-class-component](https://class-component.vuejs.org/)
- [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator#readme)

## 输出文件
输出文件即构建后生成的 HTML 文件，主要包含以下四个文件：

- https://h5.rj.unischool.cn/quiz.html

    此链接为绘本“阅读理解”模块页面

    对应 `public/quiz.ejs`，入口文件 `src/quiz.ts`，代码在 `src/modules/quiz` 目录

- https://h5.rj.unischool.cn/reading.html

    此链接为绘本“听读绘本”模块页面

    对应 `public/reading.ejs`，入口文件 `src/reading.ts`，代码在 `src/modules/reading` 目录

- https://h5.rj.unischool.cn/share.html

    此链接为“配音分享页”功能页面

    对应 `public/share.ejs`，入口文件 `src/share.ts`，代码在 `src/modules/share` 目录

- https://h5.rj.unischool.cn/ping.html
    对应 `public/ping.ejs`，该文件仅用来检测服务可用性，无其他用途

## 目录结构
```
.
├── .babelrc            babel 配置
├── .browserslistrc     browserslist 配置
├── .editorconfig       editorconfig 配置
├── .eslintignore       eslint 忽略文件配置
├── .eslintrc.js        eslint 配置
├── .gitignore          git 忽略文件配置
├── .lintstagedrc.js    lintstaged 配置
├── .prettierignore     prettier 忽略文件配置
├── .prettierrc.json    prettier 配置
├── README.md           本文档
├── build               脚手架及构建配置
├── config              环境变量等配置
├── deploy.sh           发布脚本，服务器用
├── package.json        package.json
├── postcss.config.js   postcss 配置
├── public              HTML 模板目录
├── src                 代码目录
├── static              静态资源目录
└── tsconfig.json       typescript 配置
```


## 构建方法

首先安装依赖 `npm install`

- 本地开发

运行 `npm run dev` 即可

- 线上构建

`export BUILD_STAGE=production && npm run build`

## 其他说明

- 与客户端的交互依赖脚本 `static/js/external.min.js`

    使用到的交互方法

    1. `do_external` 触发客户端提供的方法
        - disMissView 关闭当前 webview
        - playAudio 播放音频
        - stopAudio 停止音频
        - sendNotification  向客户端发送消息

    2. `bind_trigger` 监听客户端提供的事件回调
        - load 监听webview展示
        - unload 监听webview消失
        - playAudioProgress 监听音频播放进度

- 绘本的“阅读理解”模块依赖一起作业内部的答题框架 `Venus`，地址 https://cdn-cnc.17zuoye.cn/zion/venus/production/picture/1.0.4/Venus.umd.min.js
