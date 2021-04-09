export interface ParagraphData {
    align: "left" | "center" | "right";
    cameras: Array<unknown>;
    coordinate: CoordinateData;
    hasIndent: boolean;
    rank: number;
    sentences: Array<SentenceData>;
}

export interface CoordinateData {
    posX: number;
    posY: number;
    fontSize: number;
    showNewline: boolean;
    width: number;
    height: number;
    cnFontSize: number;
    cnShowNewline: boolean;
    cnWidth: number;
    cnHeight: number;
}

export interface SentenceData {
    audioUrl: string;
    cntext: string;
    entext: string;
    oralFlag: boolean;
    oralFlag17xue: boolean;
    rank: number;
    voiceText: string;
    words: Array<WordData>;
}

export interface WordData {
    audioUrlUk: string;
    audioUrlUs: string;
    cntext: string;
    entext: string;
    imageUrl: string;
    oftenUsed: boolean;
    soundmarkAudio: string;
    soundmarkText: string;
}

export interface InteractAreaData {
    posX: number;
    posY: number;
    radius: number;
    word: string;
    wordAudioUk: string;
    wordAudioUs: string;
}

export interface ContentData {
    interactAreas: Array<InteractAreaData>;
    paragraphs: Array<ParagraphData>;
    pictureThumbnailUrl: string;
    pictureUrl: string;
    rank: number;
}
