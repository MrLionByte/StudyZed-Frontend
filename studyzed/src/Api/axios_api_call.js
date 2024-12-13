import axios from "axios"
import { ACCESS_TOKEN } from './helpers/constrands'
import Cookies from 'js-cookie'


const api = axios.create({
    baseURL: "http://127.0.0.1:8005/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
      }
});

api.interceptors.request.use(
    (config) => {        
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;