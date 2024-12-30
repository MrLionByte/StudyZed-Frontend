import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../api/axios_api_call';
import { toast,ToastContainer } from 'react-toastify';
import { savedAuthData } from './Localstorage';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function GoogleApp() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [role, setRole] = useState('');
    const [showRoleSelector, setShowRoleSelector] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            loginBackend();
        },
        onError: () => toast.error('Login Failed. Please try again.'),
    });
    
    const loginBackend = async () => {
        
        const user_data = {
            'google_id': profile.id,
            'username': (profile.name).toLowerCase(),
            'email': profile.email,
            'first_name': profile.given_name,
            'token': profile.access_token,
            'role' : role,
        }
        console.log("USER FDA :" ,user_data);
        
        try{
           const response = await api.post('/auth-app/login/google-account/', user_data)
           console.log("RESPONSE :", response);
           
           const authState = {
            accessToken: response.data["access_token"],
            refreshToken: response.data["refresh_token"],
            user: response.data["user"],
            role: response.data['role'],
            isAuthenticated: true,
          };
          console.log(role, response['data']['role']);
        
        savedAuthData(authState);
        console.log("111");
        dispatch(setUser({user:response.data['user'], role: role}))
        console.log("222");

        localStorage.setItem(ACCESS_TOKEN, response.data['access_token']);
        localStorage.setItem(REFRESH_TOKEN, response.data['refresh_token']);

        console.log("333");

        toast.success('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
        setTimeout(()=>{
            if (response['data']['role'] == 'Student'){
                console.log("444");
            navigate('/student/choose-session/');
            }
            else if (response['data']['role'] == 'Tutor'){
                console.log("555");
                navigate('/tutor/choose-session/');
            }
        }, 2000);
           toast.success("Created Account, please login from login page")
            
        } catch (error) {
            console.log(error)

        }
    };

    useEffect(() => {
        if (user && user.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    setProfile(res.data)
                    setShowRoleSelector(true);
                })
                .catch(() => setError('Failed to fetch profile information.'));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };
    console.log(user);
    
    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setShowRoleSelector(false); 
        loginBackend(); 
    };

    return (
        <>
        <button
                    onClick={login}
                    className="p-2 flex items-center gap-3 text-black bg-slate-200 rounded hover:bg-slate-300"
                >
                    Sign up with
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
        </button>
        {showRoleSelector && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-lg font-semibold text-black">Select Your Role</h2>
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => handleRoleSelect('Tutor')}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Tutor
                            </button>
                            <button
                                onClick={() => handleRoleSelect('Student')}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Student
                            </button>
                        </div>
                    </div>
                </div>
            )}
        < ToastContainer autoClose='1000' />
        </>
    );
}

export default GoogleApp;
