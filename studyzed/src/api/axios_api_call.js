import axios from "axios"
import { ACCESS_TOKEN } from './helpers/constrands'
import Cookies from 'js-cookie'
import { savedAuthState, clearSavedAuthState } from "../utils/Localstorage";


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

api.interceptors.response.use(
    (response) => response,
    async (error)=> {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 &&
            !originalRequest._retry){
            const authState = getAuthState();

            try {
                const refreshResponse = await axios.post(
                    api.baseURL+'auth-app/user/login/refresh/',
                    {refresh_token: authState?.refreshToken}
                );
                const newAuthState = {
                   ...authState,
                    accessToken: refreshResponse.data.access_token,
                    refreshToken: refreshResponse.data.refresh_token,
                };
                savedAuthState(newAuthState);

                originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                clearSavedAuthState();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }   
);

export default api;