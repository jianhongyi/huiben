import request from "@/utils/request";

/**
 * 验证码，忘记密码验证码
 *
 * @param {string} mobile 手机号
 * @returns {Promise<IBaseResponse>}
 */
export default async (mobile: string): Promise<IBaseResponse> => {
    return await request(
        {
            url: "/captcha/forgetPassword.do",
            data: { mobile },
            method: "POST",
        } as IRequestParam,
        false,
    );
};
