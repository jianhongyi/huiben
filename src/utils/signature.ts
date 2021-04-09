/**
 * API 请求参数
 *
 * @author yuhao.wang
 * @date 2019-12-27 11:21:39
 */
import qs from "qs";
import md5 from "md5";

// accessToken 会在打开 URL 的时候拼接到参数上
export const ACCESS_TOKEN =
    qs.parse(location.search, { ignoreQueryPrefix: true })?.accessToken || "5e5bbcad-9403-4267-ba7b-16395424f4fb";
// version 会在打开 URL 的时候拼接到参数上
export const VERSION = qs.parse(location.search, { ignoreQueryPrefix: true })?.version || "1.0.1";
// 需要过滤的 key
const keysToDelete: string[] = ["signature"];

/**
 * 过滤掉无关参数，如 signature 本身
 */
function dataFilter(data: IRequestData): IRequestData {
    for (let index = 0; index < keysToDelete.length; index++) {
        if (data[keysToDelete[index]]) {
            delete data[keysToDelete[index]];
        }
    }
    return data;
}

/**
 * 进行生成签名需要的一系列操作
 */
function sortAndConcat(data: IRequestData): string {
    return (
        Object.keys(data)
            // step1. 将请求的所有参数（除signature外的）KV，key按照字母升序排序，所有的value转成字符串类型
            .sort()
            // step2. 将排序的所有value，用"-"符号连接起来组成新字符串
            .reduce((pre, cur) => {
                return pre + "-" + data[cur].toString();
            }, "fltrp17")
    ); // step3. 给步骤2生成的字符串加上前缀"fltrp17-"
}

/**
 * 生成 signature 的 md5 版本
 *
 * @export
 * @param {IRequestData} data 请求参数
 * @returns {string} 签名
 * @see http://wiki.17zuoye.net/pages/viewpage.action?pageId=49454904
 */
export function generateSig(data: IRequestData): string {
    // step4. md5第三步生成的字符串
    return md5(sortAndConcat(dataFilter(data)));
}

/**
 * 生成 signature 的 base64 版本
 *
 * @deprecated
 * @export
 * @param {IRequestData} data 请求参数
 * @returns {string} 签名
 * @see http://wiki.17zuoye.net/pages/viewpage.action?pageId=49454904
 */
export function generateSigFromBase64(data: IRequestData): string {
    // step4. base64编码第三步生成的字符串
    const v = btoa(sortAndConcat(dataFilter(data)));

    // step5. 将步骤4生成的字符串最后6位挪到最前
    return v.substring(v.length - 6) + v.substring(0, v.length - 6);
}
