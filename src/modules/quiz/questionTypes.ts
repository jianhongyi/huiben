export default function getTypeById(subContentTypeId: number): string {
    if (!subContentTypeId) {
        return "";
    }
    const id2Type: { [x: number]: string } = {
        1: "choice",
        2: "choice",
        3: "choice",
        4: "blank",
        5: "judge",
        6: "subjective",
        7: "lines",
        8: "classif",
        9: "sort",
        10: "choiceBlank",
        14: "oralBasic", // 基础练习里面的口语题
        16: "subjective",
        17: "subjective",
        18: "oralSubjective",
        19: "oralWordRead",
        20: "oralRoleRead",
        21: "oralFollowRead",
        24: "recogniseRead",
        27: "lines",
        28: "classif",
        29: "blank",
        30: "blank",
    };

    const type2Name: { [x: string]: string } = {
        choice: "选择题",
        blank: "填空题",
        judge: "判断题",
        subjective: "主观题",
        lines: "连线题",
        classif: "分类题",
        sort: "排序题",
        choiceBlank: "选择填空题",
        oralBasic: "口语题",
        oralSubjective: "口语题",
        oralWordRead: "口语题",
        oralRoleRead: "口语题",
        oralFollowRead: "口语题",
        recogniseRead: "认读题",
    };
    return type2Name[id2Type[subContentTypeId]];
}
