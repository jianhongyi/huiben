/**
 * 打开悠游阅读APP
 * @author yuhao.wang
 * @date 2020-01-19 17:32:02
 */

const isiOS: boolean = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

const SCHEMA_URI: string = `readingjourney://com.fltrp.readingjourney/`;
const IOS_DOWNLOAD_URL: string = `https://apps.apple.com/cn/app/id1490218827`;
const IOS_REDIRECT_URL: string = `./download.html`;
const ANDROID_DOWNLOAD_URL: string = `https://a.app.qq.com/o/simple.jsp?pkgname=com.fltrp.readingjourney`;
const downloadUrl: string = isiOS ? IOS_DOWNLOAD_URL : ANDROID_DOWNLOAD_URL;

export default function(): void {
    // 两秒后跳转到下载页
    setTimeout(() => {
        location.href = isiOS ? IOS_REDIRECT_URL : downloadUrl;
    }, 1000);

    location.href = SCHEMA_URI;
}
