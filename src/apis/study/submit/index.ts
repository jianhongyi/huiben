import request from "@/utils/request";
import { EnumJourneyModule } from "@/enums/EnumJourneyModule";

/**
 * 绘本，模块提交（H5 & 原生）
 *
 * @param {string} id 绘本ID
 * @param {EnumJourneyModule} module 模块名（不限制大小写）
 * @param {string} [data] 可选项，json字符串。BRIEF_VIDEO 不用提交该字段。
 * @returns {Promise<IBaseResponse>}
 */
export default async (id: string, module: EnumJourneyModule, data?: string): Promise<IBaseResponse> => {
    return await request({
        url: "/journey/study/submit.do",
        data: { id, module, data },
        method: "POST",
    } as IRequestParam);
};
