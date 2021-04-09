import { Emitter } from "../base/Emitter";
import { EnumHttpMethod } from "../enum/EnumHttpMethod";
import { EnumProcess } from "../enum/EnumProcess";
import { ILoader } from "./ILoader";

export class HttpLoader extends Emitter implements ILoader {
    private _xhr!: XMLHttpRequest;

    /**
     * 加载
     * @param config
     */
    public load(config: HttpLoaderParams): void {
        if (config == null || this._xhr != null) {
            return;
        }

        const url: string = config.url;
        const method: string = config.method || EnumHttpMethod.GET;
        // eslint-disable-next-line
        const data: any = config.data;
        const requestHeader: {
            [key: string]: string;
        } = config.requestHeader as { [key: string]: string };
        let sendData: unknown = null;
        if (data != null) {
            const contentType: string = config.contentType || (requestHeader && requestHeader["Content-Type"]);
            switch (method) {
                case EnumHttpMethod.POST:
                    switch (contentType) {
                        case "application/x-www-form-urlencoded":
                            // eslint-disable-next-line no-case-declarations
                            const params: Array<string> = Object.keys(data).map((key: string) => {
                                return encodeURIComponent(key) + "=" + encodeURIComponent(data[key] as string);
                            });
                            sendData = params.join("&");
                            break;
                        case "multipart/form-data":
                            sendData = new FormData();
                            Object.keys(data).forEach((key: string) => {
                                (sendData as FormData).append(key, data[key] as string);
                            });
                            break;
                        default:
                            sendData = JSON.stringify(data);
                            break;
                    }
                    break;
                case EnumHttpMethod.GET:
                    // TODO 支持data变量变为参数拼接至url后面
                    break;
                default:
                    break;
            }
        }
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        this._xhr = xhr;
        xhr.open(method, url, true);
        if (config.withCredentials) {
            xhr.withCredentials = config.withCredentials;
        }
        if (config.responseType != null) {
            xhr.responseType = config.responseType;
        }
        if (requestHeader != null) {
            const dict: { [key: string]: string } = requestHeader;
            Object.keys(dict).forEach((key: string) => {
                xhr.setRequestHeader(key, dict[key]);
            });
        }
        if (config.contentType != null) {
            xhr.overrideMimeType(config.contentType);
        }
        const onError = () => {
            this.reset();
            this.emit(EnumProcess.ERROR);
        };
        xhr.onload = () => {
            const status: number = xhr.status;
            if (status === 200) {
                const data: unknown = xhr.response || xhr.responseText;
                this.emit(EnumProcess.END, data);
            } else {
                onError();
            }
        };
        xhr.onprogress = (evt: ProgressEvent) => {
            const total = evt.total;
            const loaded = evt.loaded;
            this.emit(EnumProcess.PROGRESS, loaded, total);
        };
        xhr.onerror = () => {
            onError();
        };
        xhr.send(sendData as Document);
        this.emit(EnumProcess.START);
    }

    /** 重置 */
    public reset(): void {
        if (this._xhr == null) {
            return;
        }
        this._xhr.onreadystatechange = null;
        this._xhr.onload = null;
        this._xhr.onprogress = null;
        this._xhr.onerror = null;
        delete this._xhr;
    }
}

export interface HttpLoaderParams {
    url: string;
    method?: EnumHttpMethod;
    withCredentials?: boolean;
    // eslint-disable-next-line
    requestHeader?: any;
    // eslint-disable-next-line
    data?: any;
    responseType?: XMLHttpRequestResponseType;
    contentType?: string;
}
