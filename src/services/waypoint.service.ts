import { type AxiosInstance } from 'axios';
import axios from 'axios';

import { type IWaypoint } from '../models/waypoint';

export class WaypointService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/waypoint`
    });

    private config : any = {
        headers: {
            'Content-Language': 'en'
        }
    };

    public async getAll(): Promise<any> {
        const path = '';

        return await this.axiosInstance.get<IWaypoint[]>(path, this.config);
    }

    public async getByPhase(phaseId: number): Promise<any> {
        const path = '';
        const config = { ...this.config };
        config.params = {
            phase_id: phaseId
        }

        return await this.axiosInstance.get<IWaypoint[]>(path, config);
    }

    public async get(id: number): Promise<any> {
        const path = '/' + id;

        return await this.axiosInstance.get<IWaypoint>(path, this.config);
    }

    public async put(id: number, data: IWaypoint) : Promise<any> {
        const path = '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.put(path, data, this.config);
    }

    public async post(data: IWaypoint) : Promise<any> {
        const path = '';
        this.config.withCredentials = true;

        return await this.axiosInstance.post(path, data, this.config);
    }

    public async delete(id: number) : Promise<any> {
        const path = '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.delete(path, this.config);
    }
}