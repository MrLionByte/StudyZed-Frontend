import axios from "axios"
import { savedAuthData, clearSavedAuthData, getSavedAuthData } from "../utils/Localstorage";


export const API_BASE_URLS = {
    Usermanagement_Service: import.meta.env.VITE_USERMANAGEMENT_SERVICE,
    Message_Service: import.meta.env.VITE_MESSAGE_SERVICE,
    Notification_Service: import.meta.env.VITE_NOTIFICATION_SERVICE,
    Payment_Service: import.meta.env.VITE_PAYMENT_SERVICE,
    Session_Service: import.meta.env.VITE_SESSION_SERVICE,
};


const MAX_RETRY_ATTEMPTS = 3;

const EXCLUDED_URLS = {    
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

const key = "Usermanagement_Service";
const baseURL = API_BASE_URLS[key];

const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
      }
}); 


api.interceptors.request.use( 
    (config) => {
    
        if (!config?.url) return config;

        const exclusion = Object.keys(EXCLUDED_URLS).find(url => config?.url?.includes(url));
        
        if (exclusion && EXCLUDED_URLS[exclusion].method === config.method.toUpperCase()) {
            return config;
        }

        const authData = getSavedAuthData();
        const token = authData ?.accessToken;
        
        if (token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error)=> {
        const originalRequest = error.config;
        const status = error.response?.status || error.status;
        originalRequest.retryCount = originalRequest.retryCount || 0;

        if (status === 401 || status === 403 && 
            originalRequest.retryCount < MAX_RETRY_ATTEMPTS &&
            !originalRequest._retry){

            originalRequest.retryCount += 1;
            originalRequest._retry = true;

            try { 
                const authData = getSavedAuthData();
                const refresh_token = authData?.refreshToken;
              
                if (!refresh_token){
                    throw new Error("No refresh token available");
                }

                const refreshResponse = await axios.post(
                    `${API_BASE_URLS.Usermanagement_Service}auth-app/user/refresh/`,
                    {"refresh": refresh_token}
                );
                
                const newAuthData = {
                    ...authData,
                    accessToken: refreshResponse.data.access
                }

                savedAuthData(newAuthData);
                originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
                
                return api(originalRequest);

            } catch (refreshError) {
                if (originalRequest.retryCount >= MAX_RETRY_ATTEMPTS) {
                    clearSavedAuthData();
                    localStorage.removeItem("adminAuthState");
                    localStorage.removeItem("authState")
                    window.location.href = "/login";
                }
                if (refreshError.status === 401 && refreshError.response.statusText === 'Unauthorized'){
                    clearSavedAuthData();
                    localStorage.removeItem("adminAuthState");
                    localStorage.removeItem("authState")
                    window.location.href = "/login";
                }
                if (
                    originalRequest.retryCount >= MAX_RETRY_ATTEMPTS ||
                    (refreshError.response?.status === 401)
                  ) {
                    clearSavedAuthData();
                    localStorage.removeItem("adminAuthState");
                    localStorage.removeItem("authState");
                    window.location.href = "/login";
                  }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }   
);


export default api;