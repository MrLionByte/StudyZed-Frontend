import { useEffect, useState } from 'react';
import api from '../../../../api/axios_api_call';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Github, Twitter } from 'lucide-react';
import GoogleApp from '../../../../components/GoogleAuth/GoogleAuth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '../../../../redux/slice';
import { savedAuthData } from '../../../../utils/Localstorage';
import { useDispatch } from 'react-redux';

export default function EmailStep({ onNext }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('');
  const [getUserRole, setGetUserRole] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const savedEmail = localStorage.getItem('Temp_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) {
      toast.info('Please wait, your initial request has been loading');
      return;
    }
    if (!email) {
      toast.warning('Please enter a valid email');
    } else {
      if (!validateEmail(email)) {
        toast.warning('Please enter a valid email address.');
        return;
      }
      try {
        setSubmitting(true);
        const response = await api.post('auth-app/user-email/', { email });
        console.log('RESPONSE :', response);
        console.log('RESPONSE :', response['auth-status']);
        console.log('Browser cookies:', document.cookie);
        localStorage.setItem('Temp_email', email);
        setSubmitting(false);
        if (
          response.data['auth-status'] === 'success' &&
          response.status === 200
        ) {
          onNext();
          localStorage.removeItem('otp-expire-timer');
        } else {
          setSubmitting(false);
          toast.error('Failed to send OTP. Please try again.');
        }
      } catch (error) {
        setSubmitting(false);
        console.log('ERROR :', error);
        if (error.status == 400) {
          setSubmitting(false);
          toast.error(
            'Email is already in use. Please try with a different email address',
          );
        } else {
          setSubmitting(false);
          console.log('Email :', error);
          toast.error('Error occurred, try again later');
        }
        throw error;
      }
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignin = () => {
    navigate('/login');
  };

  const responseMessage = async (response) => {
    if (!role) {
      setGetUserRole(true);
      return;
    }
    const token = response.credential;
    console.log('Google auth response ', response);
    const decoded = jwtDecode(token);
    console.log('GASW :', decoded);
    let user_name = decoded.name.replace(/\s/g, '_');
    console.log(user_name);

    if (!role) {
      setGetUserRole(true);
      return;
    }

    const user_data = {
      google_id: decoded.sub,
      username: user_name.toLowerCase(),
      email: decoded.email,
      first_name: decoded.name,
      last_name: decoded.family_name,
      token: decoded.access_token,
      role: role,
    };

    try {
      const response = await api.post(
        '/auth-app/login/google-account/',
        user_data,
      );
      console.log(response);
      if (response.data['auth-status'] === 'success') {
        const { access_token, refresh_token, user, role, user_code } =
          response.data;

        const authState = {
          accessToken: access_token,
          refreshToken: refresh_token,
          user: user,
          role: role,
          user_code: user_code,
          isAuthenticated: true,
        };

        savedAuthData(authState);
        dispatch(setUser({ user, role }));

        const role_location = role.toLowerCase();
        console.log('4 4 4 4 4 4 4 4', role_location);
        navigate(`/${role_location}/choose-session/`);
      } else if (response.data['auth-status'] === 'created') {
        const { access_token, refresh_token, user, role, user_code } =
          response.data;

        const authState = {
          accessToken: access_token,
          refreshToken: refresh_token,
          user: user,
          role: role,
          user_code: user_code,
          isAuthenticated: true,
        };

        savedAuthData(authState);
        dispatch(setUser({ user, role }));

        setInterval(() => {
          toast.success('Created Account successfully');
        }, 1000);

        const role_location = role.toLowerCase();
        console.log('4 4 4 4 4 4 4 4', role_location);
        navigate(`/${role_location}/choose-session/`);
      } else if (response.data['auth-status'] === 'blocked') {
        console.log('Z Z Z BLOCK');
      } else {
        console.log('Z Z Z Some error occurred try again.');
      }
    } catch (error) {
      console.log('ERROR ', error);
    }
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="flex-1">
      <p className="text-sm text-gray-300 mb-6 mt-3">
        Welcome to StudyZed! Let's begin your journey
      </p>
      <form action="">
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => {
                setEmail(e.target.value);
                localStorage.setItem('Temp_email', e.target.value);
              }}
              className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 font-bold bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4"
        >
          Continue
        </button>

        <p className="text-sm text-center text-gray-300 mb-4">
          Already have an account?{' '}
          <span
            onClick={handleSignin}
            className="text-emerald-400 hover:underline hover:font-bold cursor-pointer"
          >
            Sign in
          </span>
        </p>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 border-t border-gray-500"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        <div className="flex flex-col items-center gap-4 justify-center">
          <GoogleApp clientId={GOOGLE_CLIENT_ID} />

          <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
            <Twitter className="w-5 h-5" />
          </button>
        </div>
      </form>

      {getUserRole && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold text-black">
              Select Your Role
            </h2>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setRole('Tutor')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => setRole('Student')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}
