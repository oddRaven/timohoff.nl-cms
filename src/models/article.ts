import { type ITranslation } from './translation';

export interface IArticle {
    id? : number;
    title : string;
    text : string;
    image_name : string;
    title_translations : ITranslation [];
    text_translations : ITranslation [];
};

export class Article implements IArticle {
    id? : number;
    title : string = '';
    text : string = '';
    image_name : string = '';
    title_translations : ITranslation [] = [];
    text_translations : ITranslation [] = [];
};