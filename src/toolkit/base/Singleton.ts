/** 单例 */
export class Singleton {
    /** 单例的实例 */
    private static instance: Singleton = new Singleton();

    /**
     * 添加一个单例
     * @param value 类
     * @param instance 实例(可传入非参数1 类的实例)
     */
    public static map<T>(value: new () => T, instance?: T | unknown): void {
        Singleton.instance.map(value, instance);
    }

    /**
     * 获取一个单例
     * @param value
     */
    public static get<T>(value: new () => T): T {
        return Singleton.instance.get(value);
    }

    /**
     * 移除一个单例
     * @param value
     */
    public static remove<T>(value: new () => T): void {
        Singleton.instance.remove(value);
    }

    private _singletonMap: Map<Function, unknown> = new Map();

    /**
     * 添加一个单例
     * @param value 类
     * @param instance 实例(可传入非参数1 类的实例)
     */
    public map<T>(value: new () => T, instance?: T | unknown): void {
        if (instance == null) {
            instance = this._singletonMap.get(value);
            if (instance == null) {
                instance = new value();
                this._singletonMap.set(value, instance as unknown);
            }
        } else {
            this._singletonMap.set(value, instance as unknown);
        }
    }

    /**
     * 获取一个单例
     * @param value
     */
    public get<T>(value: new () => T): T {
        let instance: T = this._singletonMap.get(value) as T;
        if (instance == null) {
            instance = instance = new value();
            this._singletonMap.set(value, instance);
        }
        return instance;
    }

    /**
     * 移除一个单例
     * @param value
     */
    public remove<T>(value: new () => T): void {
        this._singletonMap.delete(value);
    }
}
