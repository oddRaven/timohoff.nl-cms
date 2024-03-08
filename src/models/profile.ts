import { type ITranslation } from './translation';

export interface IProfile {
    id? : number;
    title : string;
    image_path : string;
    title_translations : ITranslation [];
    text_translations : ITranslation [];
};

export class Profile implements IProfile {
    id? : number;
    title : string = '';
    image_path : string = '';
    title_translations : ITranslation [] = [];
    text_translations : ITranslation [] = [];
};