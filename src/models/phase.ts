import { type ITranslation } from './translation';
import { type IWaypoint } from './waypoint';

export interface IPhase {
    id? : number;
    timeline_id? : number;
    title : string;
    color : string;
    title_translations : ITranslation [];
    waypoints : IWaypoint [];
};

export class Phase implements IPhase {
    id? : number;
    timeline_id? : number;
    title : string = '';
    color : string = '';
    title_translations : ITranslation [] = [];
    waypoints : IWaypoint [] = [];
};