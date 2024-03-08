import { type AxiosInstance } from 'axios';
import axios from 'axios';

import { type IArticle } from '../models/article';

export class ArticleService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: "http://localhost/api/article"
    });

    private config : any = {
        headers: {
            'Content-Language': 'en'
        }
    };

    public async getAll(): Promise<any> {
        const path = '';

        return await this.axiosInstance.get<IArticle[]>(path, this.config);
    }

    public async get(id: number): Promise<any> {
        const path = '/' + id;

        return await this.axiosInstance.get<IArticle>(path, this.config);
    }

    public async put(id: number, data: IArticle) : Promise<any> {
        const path = '/' + id;
        this.config.withCredentials = true;

        return await this.axiosInstance.put(path, data, this.config);
    }

    public async post(data: IArticle) : Promise<any> {
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