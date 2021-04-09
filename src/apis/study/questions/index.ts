import request from "@/utils/request";
/**
 * 绘本，获取练习（H5）
 *
 * @param {string} id 绘本ID
 * @returns {Promise<IBaseResponse>}
 */
export default async (id: string): Promise<IBaseResponse> => {
    return await request({
        url: "/journey/study/questions.do",
        data: { id },
        method: "GET",
    } as IRequestParam);
};
