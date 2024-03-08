import { type AxiosInstance } from 'axios';
import axios from 'axios';

import { type ISectionItem } from '../models/section-item';

export class SectionItemService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: "http://localhost/api/section-item"
    });

    private config : any = {
        headers: {
            'Content-Language': 'en'
        }
    };

    public async getAll(): Promise<any> {
        const path = '';

        return await this.axiosInstance.get<ISectionItem[]>(path, this.config);
    }

    public async getBySection(sectionId: number): Promise<any> {
        const path = '';
        const config = { ...this.config };
        config.params = {
            section_id: sectionId
        }

        return await this.axiosInstance.get<ISectionItem[]>(path, config);
    }

    public async get(type: string, id: number): Promise<any> {
        const path = '/' + type + '/' + id;

        return await this.axiosInstance.get<ISectionItem>(path, this.config);
    }

    public async put(type: string, id: number, data: ISectionItem) : Promise<any> {
        const path = '/' + type + '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.put(path, data, this.config);
    }

    public async post(data: ISectionItem) : Promise<any> {
        const path = '';
        this.config.withCredentials = true;

        return await this.axiosInstance.post(path, data, this.config);
    }

    public async delete(type: string, id: number) : Promise<any> {
        const path = '/' + type + '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.delete(path, this.config);
    }
}