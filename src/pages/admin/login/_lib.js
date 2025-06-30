import { useEffect, useReducer, useRef, useState } from 'react';
import api from '../../../api/axios_api_call.js'
import { adminEndPoints } from '../../../api/endpoints/adminEndPoint.js';
import { useNavigate } from 'react-router-dom';
import { savedAuthData, clearSavedAuthData } from '../../../utils/Localstorage.js';
import { useDispatch, useSelector } from 'react-redux';
import { setAdmin, adminLogout } from "../../../redux/slice.js";
import { ToastContainer, toast } from 'react-toastify';


export const adminLoginLogic = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAdminAuthenticated);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAdminAuthenticated) {
          navigate("/admin/dashboard");
        }
      }, [isAdminAuthenticated, navigate]);

    const handleNotification = (message) => {
        toast(message)
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.warning("Please enter a valid username & password");
            return;
        };
        try {
            const response = await api.post(adminEndPoints.AdminLogin,
                {username, password});
            if (response.data["auth-status"] === "success"){
            
                const authData = {
                    accessToken: response.data["access_token"],
                    refreshToken: response.data["refresh_token"],
                    role: 'Admin',
                    userId: response.data['user']['id'],
                    firstName: response.data['user']['first_name'],
                    lastName: response.data['user']['last_name'],
                    email: response.data['user']['email']
                }
             
                savedAuthData(authData);
                toast.success("Welcome Mr Admin")
                dispatch(setAdmin({user:response.data['user'], role: 'Admin'}))
                
                navigate('/admin/dashboard/');
                
            } else {
                return;
            }
            
        }
        catch (error) {
            
            if (error.response && error.response.status === 403){
                toast.error("You are not an Admin, not allowded to login.")
                clearSavedAuthData();
                dispatch(adminLogout());
            } else if (error.response && error.response.status === 404) {
                dispatch(adminLogout());
                toast.error("User does not exist or invalid password");
                clearSavedAuthData();
                
            } else {
                toast.error("Invalid username or password.");
                clearSavedAuthData();
                dispatch(adminLogout());
            }
            // console.log('ERROR :', error.status);
            // navigate('/admin/login/');
        }
    };

    return {
        username,
        password,
        setUsername,
        setPassword,
        setShowPassword,
        showPassword,
        handleSubmit,
        error,
        setError,
    }
    
}