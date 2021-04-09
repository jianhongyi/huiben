import request from "@/utils/request";

/**
 * 绘本，配音分享页面（H5）
 *
 * @param {string} id 用户配音ID
 * @returns {Promise<IBaseResponse>}
 */
export default async (id: string): Promise<IBaseResponse> => {
    return await request({
        url: "/journey/shared.do",
        data: { id },
        method: "GET",
    } as IRequestParam);
};
