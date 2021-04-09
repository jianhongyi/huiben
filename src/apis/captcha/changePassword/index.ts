import request from "@/utils/request";

/**
 * 验证码，修改密码验证码
 *
 * @param {string} mobile 手机号
 * @returns {Promise<IBaseResponse>}
 */
export default async (mobile: string): Promise<IBaseResponse> => {
    return await request({
        url: "/captcha/changePassword.do",
        data: { mobile },
        method: "POST",
    } as IRequestParam);
};
