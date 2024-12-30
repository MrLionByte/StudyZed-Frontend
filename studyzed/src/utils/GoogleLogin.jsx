import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../api/axios_api_call';
import { toast,ToastContainer } from 'react-toastify';
import { savedAuthData } from './Localstorage';
import { useDispatch } from 'react-redux';

function GoogleApp({onGoogleLogin}) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [role, setRole] = useState('');
    const [showRoleSelector, setShowRoleSelector] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            onGoogleLogin(profile.id, profile.email)
        },
        onError: () => toast.error('Login Failed. Please try again.'),
    });

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



    return (
        <>
        <button
                    onClick={login}
                    className="p-2 flex items-center gap-3 text-black bg-slate-200 rounded hover:bg-slate-300"
                >
                    Sign in
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
        </button>
        < ToastContainer autoClose='1000' />
        </>
    );
}

export default GoogleApp;
