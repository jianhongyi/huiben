import request from "@/utils/request";

/**
 * 登录
 *
 * @param {string} mobile 手机号
 * @param {string} password 密码
 * @returns {Promise<IBaseResponse>}
 */
export default async (mobile: string, password: string): Promise<IBaseResponse> => {
    return await request(
        {
            url: "/login.do",
            data: { mobile, password },
            method: "POST",
        } as IRequestParam,
        false,
    );
};
