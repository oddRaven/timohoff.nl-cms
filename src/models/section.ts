import { type ITranslation } from './translation';

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