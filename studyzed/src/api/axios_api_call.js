import axios from "axios"
import { ACCESS_TOKEN } from './helpers/constrands'
import Cookies from 'js-cookie'
import { savedAuthData, clearSavedAuthData, getSavedAuthData } from "../utils/Localstorage";

export const api_dictatory = {
    "Usermanagement_Service": "http://127.0.0.1:8005/",
    "Payment_Service"       : "http://127.0.0.1:8008/",
    "Session_Service"       : "http://127.0.0.1:8009/",
};

const key = "Usermanagement_Service";
const baseURL = api_dictatory[key];

const api = axios.create({
    // baseURL: "http://127.0.0.1:8005/",
    baseURL: baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
      }
}); 

const excludedUrls = {    
    'auth-app/user-email/':{ method: 'POST' },
    'auth-app/verify-otp/':{ method: 'POST' },
    'auth-app/resend-otp/':{ method: 'POST' },
    'auth-app/user-details/':{ method: 'POST' },

    'auth-app/login/google-account/':{ method: 'POST' },
    'auth-app/login/forgot-password/':{ method: 'POST' },
    'auth-app/login/forgot-password/otp-verify/':{ method: 'POST' },
    'auth-app/login/forgot-password/change-password/':{ method: 'POST' },

    'auth-app/login/': { method: 'POST' },
    'auth-app/user/refresh/': { method: 'POST' },

    'admin-app/login-strict/':{ method: 'POST' },
};


api.interceptors.request.use( 
    (config) => {
        console.log("cofig :",config);
        
        const exclusion = Object.keys(excludedUrls).find(url => config.url.includes(url));
        
        if (exclusion && excludedUrls[exclusion].method === config.method.toUpperCase()) {
            console.log("EXCL");
            
            return config;
        }

        const authData = JSON.parse(localStorage.getItem("authData"));      
        const token = (authData ? authData["accessToken"] : null ) 
        
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
        console.log("REFRESH ERROR :",error.status);
        
        if (error.response && 
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry){

            originalRequest._retry = true;
                console.log("RESEND REFRESH WORLINGG");
            try { 
                const authData = getSavedAuthData();
                const refresh_token = authData.refreshToken || null;
                console.log("Auth Data  :", authData, refresh_token);

                if (!refresh_token){
                    throw new Error("No refresh token available");
                }

                const refreshResponse = await axios.post(
                    'http://127.0.0.1:8005/auth-app/user/refresh/',
                    {"refresh": refresh_token}
                );
                console.log("refreshResponse CAme:", refreshResponse);
                
                authData.accessToken = refreshResponse.data.access;
                savedAuthData(authData);

                originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                clearSavedAuthData();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }   
);



export default api;