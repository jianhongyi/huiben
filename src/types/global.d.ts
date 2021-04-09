interface Window {
    /**
     * 调试工具
     * @type {*}
     * @memberof Window
     */
    eruda: any;

    /**
     * 客户端与前端桥接关键字
     */
    readingjourney: any;
    do_external: any;
    bind_trigger: any;
}

declare let __DEV__: boolean;
declare let __ENV__: string;
declare let __BASE_URL__: string;

// 允许绕过在import时对html、css、json 等扩展名的检查
declare module "*.html" {
    const str: string;
    export default str;
}
declare module "*.css" {
    const str: string;
    export default str;
}
declare module "*.json" {
    const str: string;
    export default str;
}
declare module "*.jpg" {
    const str: string;
    export default str;
}
declare module "*.jpeg" {
    const str: string;
    export default str;
}
declare module "*.png" {
    const str: string;
    export default str;
}
declare module "*.gif" {
    const str: string;
    export default str;
}
declare module "*.mp3" {
    const str: string;
    export default str;
}
