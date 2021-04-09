import request from "@/utils/request";

/**
 * 验证码，注册验证码
 *
 * @param {string} mobile 手机号
 * @returns {Promise<IBaseResponse>}
 */
export default async (mobile: string): Promise<IBaseResponse> => {
    return await request(
        {
            url: "/captcha/register.do",
            data: { mobile },
            method: "POST",
        } as IRequestParam,
        false,
    );
};
