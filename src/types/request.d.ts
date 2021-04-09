/**
 * 请求通用字段
 *
 * @author yuhao.wang
 * @date 2019-12-24 15:16:38
 * @see http://wiki.17zuoye.net/pages/viewpage.action?pageId=49451877
 */

type IBaseResponse = Readonly<IResponse> | undefined;

interface IResponse {
    success: boolean; // 返回值时，表示是否成功
    errorCode: number; // success 是 false 时返回，表示错误码
    info: string; // success 是 false 时返回，表示错误信息
    sysTime: number; // success 是 true 时返回，表示消息返回时刻的服务器时间戳，单位秒
    data: any; // 正常返回时，数据字段全都在data下铺开。没有返回 null
}

interface IBaseRequest {
    accessToken: string; // 已登录令牌，登录后访问接口，必传该字段。测试环境传入 fake，会跳过用户验证
    signature: string; // 请求签名，对请求参数加密，详见签名加密算法
    version: string; // 版本号
}

interface IRequestParam {
    /** 请求的 url */
    url: string;
    /** 请求的方法, 默认 GET */
    method?: "POST" | "GET";
    /** 传入的数据 */
    data?: IRequestData;
}

interface IRequestData {
    [x: string]: string | number | boolean;
}
