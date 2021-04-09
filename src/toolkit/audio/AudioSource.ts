import { EnumHttpMethod } from "../enum/EnumHttpMethod";
import { EnumLoadState } from "../enum/EnumLoadState";
import { EnumProcess } from "../enum/EnumProcess";
import { HttpLoader } from "../loader/HttpLoader";

/** 音频源数据 */
export class AudioSource {
    /** 设置加载成功后转化数据类型 */
    public static convertTypes: { base64: boolean; arrayBuffer: boolean } = {
        base64: true,
        arrayBuffer: false,
    };

    private static _sourceMap: { [key: string]: AudioSource } = {};
    /**
     * 加载音频数据
     * @param url
     * @param cache
     */
    public static async load(url: string, cache: boolean = true): Promise<AudioSource> {
        let data: AudioSource = AudioSource._sourceMap[url];
        if (data == null) {
            data = new AudioSource(url);
            AudioSource._sourceMap[url] = data;
        }
        if (data.loadState !== EnumLoadState.LOADED) {
            await data.load();
            if (!cache) {
                delete AudioSource._sourceMap[url];
            }
        }
        return data;
    }
    /**
     * 获取音频数据
     * @param url
     */
    public static get(url: string): AudioSource | null {
        const data: AudioSource = AudioSource._sourceMap[url];
        if (data != null && data._loadState === EnumLoadState.LOADED) {
            return data;
        } else {
            return null;
        }
    }

    /**
     * 预加载音频列表
     * @param list
     * @param cache
     */
    public static loadList(list: Array<string>, cache?: boolean): Promise<{ [key: string]: AudioSource }> {
        return new Promise((resolve: (sourceMap: { [key: string]: AudioSource }) => void) => {
            const tempList: Array<string> = list.concat();
            const resultMap: { [key: string]: AudioSource } = {};
            const checkLoaded = (source: AudioSource | string) => {
                let url: string;
                if (source instanceof AudioSource) {
                    url = source.url;
                    resultMap[source.url] = source;
                } else {
                    url = source;
                    delete resultMap[source];
                }
                const index: number = tempList.indexOf(url);
                if (index >= 0) {
                    tempList.splice(index, 1);
                }
                if (tempList.length === 0) {
                    resolve(resultMap);
                }
            };
            for (let i: number = 0, length: number = tempList.length; i < length; i += 1) {
                const url: string = tempList[i];
                const src: AudioSource = AudioSource.get(url) as AudioSource;
                if (src == null) {
                    AudioSource.load(url, cache)
                        .then((source: AudioSource) => {
                            checkLoaded(source);
                        })
                        .catch(() => {
                            checkLoaded(url);
                        });
                } else {
                    checkLoaded(src);
                }
            }
        });
    }

    constructor(url: string) {
        this._url = url;
    }

    private _url: string;
    /** url */
    public get url(): string {
        return this._url;
    }
    private _blob!: Blob;
    /** blob数据 */
    public get blob(): Blob {
        return this._blob;
    }
    private _base64!: string;
    /** base64数据 */
    public get base64(): string {
        return this._base64;
    }
    private _arrayBuffer!: ArrayBuffer;
    /** ArrayBuffer数据 */
    public get arrayBuffer(): ArrayBuffer {
        return this._arrayBuffer;
    }

    private _loadState: EnumLoadState = EnumLoadState.UNLOAD;
    /** 是否加载完成 */
    public get loadState(): EnumLoadState {
        return this._loadState;
    }

    private _loader: HttpLoader = new HttpLoader();
    /** 加载 */
    public load(): Promise<AudioSource> {
        return new Promise((resolve: (data: AudioSource) => void, reject: Function) => {
            if (this._loadState === EnumLoadState.LOADED) {
                resolve(this);
                return;
            }
            if (this._loadState !== EnumLoadState.LOADING) {
                this._loadState = EnumLoadState.LOADING;
                this._loader.load({
                    url: this._url,
                    method: EnumHttpMethod.GET,
                    responseType: "blob",
                });
            }
            const completeHandler = async (response: unknown) => {
                const blob: Blob = response as Blob;
                this._blob = blob;
                if (AudioSource.convertTypes.base64) {
                    await this.readAsDataURL();
                }
                if (AudioSource.convertTypes.arrayBuffer) {
                    await this.readAsArrayBuffer();
                }
                this._loadState = EnumLoadState.LOADED;
                resolve(this);
            };
            const errorHandler = () => {
                this._loader.reset();
                this._loadState = EnumLoadState.ERROR;
                reject();
            };
            this._loader.once(EnumProcess.END, completeHandler, this);
            this._loader.once(EnumProcess.ERROR, errorHandler, this);
        });
    }

    /** 转化成base64 */
    public readAsDataURL(): Promise<string> {
        return new Promise((resolve: (data: string) => void) => {
            if (this._blob == null || this._base64 != null) {
                resolve(this._base64);
                return;
            }
            const stringReader: FileReader = new FileReader();
            stringReader.readAsDataURL(this._blob);
            stringReader.onload = () => {
                this._base64 = stringReader.result as string;
                resolve(this._base64);
            };
        });
    }

    /** 转化成ArrayBuffer */
    public readAsArrayBuffer(): Promise<ArrayBuffer> {
        return new Promise((resolve: (data: ArrayBuffer) => void) => {
            if (this._blob == null || this._arrayBuffer != null) {
                resolve(this._arrayBuffer);
                return;
            }
            const bufferReader: FileReader = new FileReader();
            bufferReader.readAsArrayBuffer(this._blob);
            bufferReader.onload = () => {
                this._arrayBuffer = bufferReader.result as ArrayBuffer;
                resolve(this._arrayBuffer);
            };
        });
    }
}
