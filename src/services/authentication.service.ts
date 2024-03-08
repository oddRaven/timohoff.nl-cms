import { type AxiosInstance } from 'axios';
import axios from 'axios';

export class AuthenticationService {
    private axiosInstance : AxiosInstance = axios.create({
        baseURL: "http://localhost/api/authentication"
    });

    private config : any = {
        headers: {
            'Content-Language': 'en'
        }
    };

    public async login(data: any) : Promise<any> {
        const path = '';
        this.config.withCredentials = true;

        return await this.axiosInstance.post(path, data, this.config);
    }

    public async logout() : Promise<any> {
        const path = '';

        return await this.axiosInstance.delete(path, this.config);
    }
}
