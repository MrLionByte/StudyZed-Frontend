import { useEffect, useReducer, useRef, useState } from 'react';
import api from '../../../api/axios_api_call.js'
import { adminEndPoints } from '../../../api/endpoints/adminEndPoint.js';
import { useNavigate } from 'react-router-dom';
import { savedAuthData } from '../../../utils/Localstorage.js';
import { useDispatch } from 'react-redux';
import { setAdmin } from "../../../redux/slice.js";


export const adminLoginLogic = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter a valid email & password");
            return;
        };
        try {
            const response = await api.post(adminEndPoints.AdminLogin,
                {email, password});
                console.log("ADMIN LOGIN", response.data.data);
            const adminAuthState = {
                accessToken: response.data.data["access_token"],
                refreshToken: response.data.data["refresh_token"],
                // role: 'Admin',
                // userId: response.data['user']['id'],
                // firstName: response.data['user']['first_name'],
                // lastName: response.data['user']['last_name'],
            }
            console.log("ADMIN LOGIN", adminAuthState);
            
            savedAuthData(adminAuthState);
            dispatch(setAdmin({user:response.data['user'], role: 'Admin'}))
            // localStorage.setItem(ACCESS_TOKEN, response.data['access_token']);
            // localStorage.setItem(REFRESH_TOKEN, response.data['refresh_token']);
            // alert('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
            // navigate('/student/choose-session/');
        }
        catch (error) {
            console.log('ERROR :', error);
            alert("Failed to login. Please try again.");
            navigate('/admin/login/');
        }
    };

    return {
        email,
        password,
        setEmail,
        setPassword,
        setShowPassword,
        showPassword,
        handleSubmit,
    }
    
}