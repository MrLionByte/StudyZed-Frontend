import api from "../api/axios_api_call";
import { getSavedAuthData } from "./Localstorage";

const logoutUser = async () => {
    const auth = getSavedAuthData();
try{
    await api.post("auth-app/logout/",{
        refresh: auth.refreshToken,
        access: auth.accessToken
    });
    
    } catch (error) {
        console.error('^^^^');
  }
}

export default logoutUser;
