import { type IProfile } from './profile';
import { type ITranslation } from './translation';

export interface IProfileCollection {
    id? : number;
    title : string;
    profiles : IProfile [];
    title_translations : ITranslation [];
    text_translations : ITranslation [];
};

export class ProfileCollection implements IProfileCollection {
    id? : number;
    title : string = '';
    profiles : IProfile [] = [];
    title_translations : ITranslation [] = [];
    text_translations : ITranslation [] = [];
};