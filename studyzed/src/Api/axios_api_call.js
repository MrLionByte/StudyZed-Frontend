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
        // const token = localStorage.getItem(ACCESS_TOKEN);
        // const accessToken = null
        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MzUzNzQxLCJpYXQiOjE3MzQzNTAxNDEsImp0aSI6IjM2NDc4OTI4Nzc2NTRiMzliYjgxOThiNmE5MTMxZGY3IiwidXNlcl9pZCI6Mn0.OJUa0zwAV8Cs0BpzQqCN6KV17glefBbgd0TAe_y45Gc"
        
        const token = accessToken;
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