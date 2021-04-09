interface IDialogParam {
    title?: string;
    content: string;
    subBtn?: IDialogBtnParam;
    mainBtn: IDialogBtnParam;
    closeBtn?: IDialogBtnParam;
}

interface IDialogBtnParam {
    action?: () => void;
    label?: string;
}

interface IToastParam {
    content: string;
    timeout?: number;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
