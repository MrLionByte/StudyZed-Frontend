import { useEffect, useReducer, useRef, useState } from 'react';
import api from '../../../api/axios_api_call'
import { adminEndPoints } from '../../../api/endpoints/adminEndPoint.js';


export const adminLoginLogic = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
   
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!email || !password) {
    //         alert("Please enter a valid email & password");
    //         return;
    //     };
    //     try {
    //         const response = await api.post("auth-app/login/",{email, password});

    //         if (role.toLowerCase() !== (response['data']['role']).toLowerCase()){
    //             alert("You are not a student.");
    //             return false;
    //         }
            
    //         const authState = {
    //             accessToken: response.data["access_token"],
    //             refreshToken: response.data["refresh_token"],
    //             role: role,
    //             userId: response.data['user']['id'],
    //             firstName: response.data['user']['first_name'],
    //             lastName: response.data['user']['last_name'],
    //         }

    //         savedAuthData(authState);
    //         dispatch(setUser({user:response.data['user'], role: role}))
    //         localStorage.setItem(ACCESS_TOKEN, response.data['access_token']);
    //         localStorage.setItem(REFRESH_TOKEN, response.data['refresh_token']);
    //         alert('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
    //         navigate('/student/choose-session/');
    //     }
    //     catch (error) {
    //         console.log('ERROR :', error);
    //         alert("Failed to login. Please try again.");
    //     }
    // };

    return {
        email,
        password,
        setEmail,
        setPassword,
        setShowPassword,
    }
    
}