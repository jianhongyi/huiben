import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";
import _Toast from "./Toast.vue";

class Toast {
    static install(_Vue: typeof Vue): void {
        const __Toast = _Vue.extend(_Toast);
        const instance = new __Toast() as CombinedVueInstance<
            Vue,
            unknown & IToastParam & { show: boolean },
            unknown,
            unknown,
            unknown
        >;
        instance.$mount(document.createElement("div"));
        document.body.appendChild(instance.$el);

        _Vue.prototype.$toast = (param: IToastParam) => {
            instance.show = true;
            instance.content = param.content;
            param.timeout && (instance.timeout = param.timeout);
        };
    }
}

export default Toast;
