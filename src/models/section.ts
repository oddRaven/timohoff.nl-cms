export interface ISection {
    id? : number;
    title : string;
    title_translations : ITranslation [];
};

export class Section implements ISection {
    id? : number;
    title : string = '';
    title_translations : ITranslation [] = [];
};

interface ITranslation {
    code : string;
    text : string;
}