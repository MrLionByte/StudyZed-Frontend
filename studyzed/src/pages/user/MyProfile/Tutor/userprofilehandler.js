import { useReducer } from 'react';
import api  from '../../../../Api/axios_api_call';

export const fetchUserProfile = async() => {
    try{
        const response = await api.get('auth-app')
    } catch (error) {
        return {success: false, error: error.message};
    }
};

export const uploadAndupdateProfilePic = async () => {
    try{
        const response = await api.post('auth-app/upload-profile-pic/', {file: file})
    } catch (error) {
        return {success: false, error: error.message};
    }
};

export const uploadAndupdateCoverPic = async () => {
    
};

export const updateUserDetails = async () => {

};