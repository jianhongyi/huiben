import { ACCESS_TOKEN, generateSig, VERSION } from "@/utils/signature";
import axios, { AxiosResponse, AxiosError } from "axios";
import qs from "qs";
import Vue from "vue";

axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.withCredentials = true;

// axios.interceptors.response.use(
//     function(response) {
//         // Any status code that lie within the range of 2xx cause this function to trigger
//         // Do something with response data
//         if (response?.data.success === false) {
//             Vue.prototype.$dialog({
//                 content: response?.data?.info || "网络错误",
//             });
//         }

//         return response;
//     },
//     function(error: AxiosError) {
//         return Promise.reject(error);
//     },
// );

function installInterceptors(withDialog = true) {
    axios.interceptors.response.use(
        function(response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            if (response?.data.success === false) {
                withDialog &&
                    Vue.prototype.$dialog({
                        content: response?.data?.info || "网络错误",
                    });
            }

            return response;
        },
        function(error: AxiosError) {
            return Promise.reject(error);
        },
    );
}
if (__DEV__) {
    axios.defaults.baseURL = "";
}

export default async function request(param: IRequestParam, withDialog = true): Promise<IBaseResponse> {
    installInterceptors(withDialog);
    const config: IRequestParam = Object.assign(
        {
            method: "GET",
            data: {} as IRequestData,
        },
        param,
    );

    // 请求接口时需要附带 signature 和 accessToken
    const requestParam = Object.assign(config.data, {
        accessToken: ACCESS_TOKEN,
        version: VERSION,
    } as IBaseRequest);

    Object.assign(config.data, {
        signature: generateSig(requestParam),
    });

    let res!: AxiosResponse;
    try {
        if (config.method === "POST") {
            res = await axios.post(config.url, qs.stringify(config.data), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
        } else {
            res = await axios.get(config.url, { params: config.data });
        }
    } catch (error) {
        // TODO: global request error handler
        console.warn("request error: ", error?.toJSON());
    }

    return res?.data;
}
