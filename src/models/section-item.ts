import { type ITranslation } from './translation';

export interface ISectionItem {
    title : string;
    title_translations : ITranslation [];
    section_id? : number;
    item_id? : number;
    item_type? : string;
    order : number;
};

export class SectionItem implements ISectionItem {
    title : string = '';
    title_translations : ITranslation [] = [];
    section_id? : number;
    item_id? : number;
    item_type? : string = 'articles';
    order : number = 0;
};