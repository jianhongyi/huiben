import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";
import _Dialog from "./Dialog.vue";

class Dialog {
    static install(_Vue: typeof Vue): void {
        const __Dialog = _Vue.extend(_Dialog);
        const instance = new __Dialog() as CombinedVueInstance<
            Vue,
            unknown & IDialogParam & { show: boolean },
            unknown,
            unknown,
            unknown
        >;
        instance.$mount(document.createElement("div"));
        document.body.appendChild(instance.$el);

        _Vue.prototype.$dialog = (param: IDialogParam) => {
            instance.show = true;
            instance.content = param.content;
            instance.title = param.title || "";
            instance.subBtn = param.subBtn;
            instance.mainBtn = param.mainBtn;
        };
    }
}

export default Dialog;
