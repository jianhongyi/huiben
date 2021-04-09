import request from "@/utils/request";

/**
 * 注册
 *
 * @param {string} mobile 手机号
 * @param {string} password 密码
 * @param {string} smsCode 短信验证码
 * @returns {Promise<IBaseResponse>}
 */
export default async (mobile: string, password: string, smsCode: string): Promise<IBaseResponse> => {
    return await request(
        {
            url: "/register.do",
            data: { mobile, password, smsCode },
            method: "POST",
        } as IRequestParam,
        false,
    );
};
