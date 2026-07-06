import { type ITranslation } from './translation';

export interface IWaypoint {
    id? : number;
    phase_id? : number;
    article_id? : number;
    title : string;
    location : string;
    image_source : string;
    is_bound : boolean;
    title_translations : ITranslation [];
};

export class Waypoint implements IWaypoint {
    id? : number;
    phase_id? : number;
    article_id? : number;
    title : string = '';
    location : string = '';
    image_source : string = '';
    is_bound : boolean = false;
    title_translations : ITranslation [] = [];
};