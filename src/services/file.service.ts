import { type AxiosInstance } from 'axios';
import axios from 'axios';

export class FileService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/file`
    });

    public async upload(file: File, name: string) : Promise<any> {
        const path = '/upload';
        const formData = new FormData();

        formData.append('file', file);
        formData.append('name', name);

        const headers : any = {
            'Content-Language': 'en'
        };

        const config : any = {
            headers,
            withCredentials: true
        };

        return await this.axiosInstance.post(path, formData, config);
    }
}