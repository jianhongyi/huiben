/**
 * type declaration for Venus lib
 * @author yuhao.wang
 * @date 2019-08-13 14:33:54
 */

interface Window {
    Venus: IVenusInstance;
}

// Venus 部分方法
interface IVenusInstance {
    new (param: IVenusInitParams): this;
    init: (param: IVenusInitParams) => void;
    commit: () => void;
    getPrevQuestion: () => void;
    getNextQuestion: () => void;
    getCurrentUserAnswer: () => string;
    getAllUserAnswer: () => string[];
    getTotalNum: () => number;
    getCurrentNum: () => number;
    getCurrentQuestionTypes: () => unknown;
    destroy: () => void;
    displayAnswerResult: () => void;
    hideKeyboard: () => void;
}

// Venus 初始化参数
interface IVenusInitParams {
    container?: string; // 容器的id
    el?: string; // 容器的id, venus.picture 用
    questionList: any[]; // 试题数组，包含完整的试题json结构
    framework?: {
        vue: any; // vue 的外部引用
        vuex: any; // vuex 的外部引用
    };
    commitType?: "local" | "remote"; // 结果提交方式：'local'/'remote'
    readonly?: boolean; // 是否只读模式，不可答题
    answerPosition?: "all" | "up" | "down" | false; // 答案展示的位置，'up'/'down'/'all'/false
    showAnalysis?: boolean | "right" | "wrong"; // 是否展示解析, true/false/'wrong'/'right'
    showUserAnswer?: boolean | "right" | "wrong"; // 是否展示用户答案, true/false/boolean | 'right' | 'wrong'/'right'
    showRightAnswer?: "wrong"; // 是否展示正确答案, true/false/'wrong'/'right'
    showCommitBtn?: boolean; // 是否展示提交按钮
    showNextBtn?: boolean; // 是否显示下一题按钮
    showFinishBtn?: boolean; // 是否显示完成按钮
    showRedoBtn?: boolean; // 是否显示重做按钮
    getQuestionRemote?: boolean; // 是否自己去取题
    autoFocusBlank?: boolean; // 填空题是否自动聚焦第一个空，并弹出键盘
    startIndex?: number; // 从第几道题开始，默认为第一道
    currentIndex?: number; // 同 startIndex
    listMode?: boolean; // 是否开启列表渲染模式，默认为false
    caseSensitive?: boolean; // 填空题是否大小写敏感，默认不敏感。
    orientation?: "portrait" | "landscape"; // 屏幕朝向：portrait|landscape
    autoPlayAudio?: boolean; // 是否自动播放音频，默认不自动播放
    disabledBeforePlayAudio?: boolean; // 题干音频播放完成前禁止答题，默认不禁止 目前只支持选择题
    popFeedback?: boolean; // 答题结果是否显示动画效果和音效，答对后不展示答案框，动画结束后自动跳下一题
    oralBasicRecordTimes?: number; // 基础口语录音次数，默认3次
    review?: boolean; // 是否为复习模式
    customBtns?: {
        id: string;
        text: string;
        onClick: () => void;
    }[]; // 自定义按钮，显示在底部（如果有超过2个，需要自己修改css来做布局）
    onReady?: (qObj: any) => void; // 首屏渲染完毕，参数：qobj:当前题目结构
    onQuestionRender?: (index: number, qObj: any) => void; //单题渲染完毕，参数：index:当前题目索引，qobj:当前题目结构

    onFomulaRender?: (index: number, qObj: any) => void; // 公式渲染完成的时候触发，这个回调在onQuestionRender之后，因为公式渲染通常是耗时的，参数：index:当前题目索引，qobj:当前题目结构
    onOptionClick?: (index: number, qObj: any) => void; // 选项被点击，参数：qindex:当前选项索引，qobj:当前题目结构
    onBlankFill?: (qobj: any, index: number, value: string, pointList: any[]) => void; // 填空，当前空的值有变化时触发，参数：qobj:当前题目结构，index:当前空的索引，value:当前空的内容，pointList:语文听写题型的手写轨迹
    onNext?: (index: number) => boolean; // 跳转到下一题时触发（点击“下一题”按钮或调用Venus.getNextQuestion()），如果返回false，则阻断执行，参数：index:下一题的题目索引
    onPrev?: (index: number) => boolean; // 跳转到上一题时触发（调用Venus.getPrevQuestion()），如果返回false，则阻断执行，参数：index:上一题的题目索引
    onCommit?: (qObj: any) => boolean; // 提交时触发（点击“提交”按钮或调用Venus.commit()），如果返回false，则阻断执行，不会提交，参数：qobj:当前题目结构
    onResult?: (result: any, qObj: any) => void; // 提交判题结束后触发，参数：result:当前题目答题结果数据
    onFinish?: (resultList: any[]) => void; // 点击完成按钮触发，参数：resultList:所有答题结果列表
    onDestroyed?: () => void; // Venus被销毁时触发
    onError?: (error: Error, el: any, info: string, externalInfo: string) => void; // Venus内部报错时触发，参数：error:Error对象，el:报错的组件，info:报错信息（字符串），externalInfo:外壳的信息（字符串）
}

interface IVenusResult {
    [qId: string]: {
        answers: unknown[][];
        master: boolean;
        subMaster: boolean[][];
        userAnswers: string[][];
    };
}

declare const Venus: IVenusInstance;
