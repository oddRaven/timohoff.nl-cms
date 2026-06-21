import { type AxiosInstance } from 'axios';
import axios from 'axios';

export class FileService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/file`
    });

    public async upload(file: File, token?: string) : Promise<any> {
        const path = '/upload';
        const formData = new FormData();

        formData.append('file', file);

        /*const resolvedToken = token
            || localStorage.getItem('token')
            || localStorage.getItem('access_token')
            || '';*/

        const headers : any = {
            'Content-Language': 'en'
        };

        /*if (resolvedToken) {
            headers.Authorization = `Bearer ${resolvedToken}`;
        }*/

        const config : any = {
            headers,
            withCredentials: true
        };

        return await this.axiosInstance.post(path, formData, config);
    }
}