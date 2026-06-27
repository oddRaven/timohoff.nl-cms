import { type ITranslation } from './translation';

export interface IProfile {
    id? : number;
    article_id? : number;
    profile_collection_id? : number;
    title : string;
    image_name : string;
    title_translations : ITranslation [];
};

export class Profile implements IProfile {
    id? : number;
    article_id? : number;
    profile_collection_id? : number;
    title : string = '';
    image_name : string = '';
    title_translations : ITranslation [] = [];
};