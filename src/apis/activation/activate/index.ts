import request from "@/utils/request";

/**
 * 激活码，激活
 *
 * @param {string} activationCode 激活码
 * @returns {Promise<IBaseResponse>}
 */
export default async (activationCode: string): Promise<IBaseResponse> => {
    return await request(
        {
            url: "/activation/activateH5.do",
            data: { activationCode },
            method: "POST",
        } as IRequestParam,
        false,
    );
};
