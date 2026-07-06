import { type IPhase } from './phase';
import { type ITranslation } from './translation';

export interface ITimeline {
    id? : number;
    title : string;
    title_translations : ITranslation [];
    phases : IPhase [];
};

export class Timeline implements ITimeline {
    id? : number;
    title : string = '';
    title_translations : ITranslation [] = [];
    phases : IPhase [] = [];
};