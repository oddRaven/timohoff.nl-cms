import { type AxiosInstance } from 'axios';
import axios from 'axios';

import { type IPhase } from '../models/phase';

export class PhaseService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/phase`
    });

    private config : any = {
        headers: {
            'Content-Language': 'en'
        }
    };

    public async getAll(): Promise<any> {
        const path = '';

        return await this.axiosInstance.get<IPhase[]>(path, this.config);
    }

    public async getByTimeline(timelineId: number): Promise<any> {
        const path = '';
        const config = { ...this.config };
        config.params = {
            timeline_id: timelineId
        }

        return await this.axiosInstance.get<IPhase[]>(path, config);
    }

    public async get(id: number): Promise<any> {
        const path = '/' + id;

        return await this.axiosInstance.get<IPhase>(path, this.config);
    }

    public async put(id: number, data: IPhase) : Promise<any> {
        const path = '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.put(path, data, this.config);
    }

    public async post(data: IPhase) : Promise<any> {
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