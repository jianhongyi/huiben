import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";

declare module "vue/types/vue" {
    interface Vue {
        $dialog: (param: IDialogParam, thisArg?: Vue) => void;
        $toast: (param: IToastParam) => void;
    }
}
