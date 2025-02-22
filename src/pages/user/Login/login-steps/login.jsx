import { useState } from 'react';
import api from '../../../../api/axios_api_call.js';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import { savedAuthData } from '../../../../utils/Localstorage.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../redux/slice.js';
import { toast, ToastContainer } from 'react-toastify';
import LoginPic from '../../../../assets/loginpic.png';
import LogoSvg from '../../../../assets/test.svg';
import { useSelector } from 'react-redux';
import { Github, Twitter } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function TutorStudentlogin({ passwordForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    general: '',
  });

  const [loading, setLoading] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetErrors = () => {
    setErrorMessages({ email: '', password: '', general: '' });
  };

  const getErrorMessages = (authStatus) => {
    switch (authStatus) {
      case 'user-notexsist':
        return { email: 'This email is not registered.' };
      case 'password-failed':
        return {
          password:
            'Your password is incorrect. Try again or try forgot password',
        };
      case 'user-blocked':
        toast.error('Your account is blocked. Contact the admin.');
        return {};
      default:
        return { general: 'Login failed. Please try again later.' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessages({ general: 'Please enter both email and password.' });
      return;
    }

    setLoading(true);
    resetErrors('');

    try {
      const response = await api.post('auth-app/login/', { email, password });

      console.log('TOAST :', response);
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

      toast.success(`LOGIN SUCCESSFUL. Welcome ${user.first_name}`);

      setTimeout(() => {
        const redirectPath =
          role === 'STUDENT'
            ? '/student/choose-session/'
            : '/tutor/choose-session/';
        navigate(redirectPath);
      }, 2500);
    } catch (error) {
      const authStatus =
        error.response?.data?.errors['auth-status']?.[0] || 'unknown';

      const errorMessage = getErrorMessages(authStatus);
      setErrorMessages(errorMessage);
    } finally {
      setLoading(false);
    }
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    passwordForgot();
  };

  return (
    <div className="flex-1">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <Link to="/">
          <img src={LogoSvg} alt="Logo" className="w-14 h-14" />
        </Link>
        <h2 className="text-xl font-semibold">Get Started</h2>
      </div>
      <p className="text-sm text-gray-300 mb-6">
        Welcome back to StudyZed! Let's create future
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-gray-300">Username / Email</label>

          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {errorMessages.email && (
            <p className="text-red-600 font-medium text-center">
              {errorMessages.email}
            </p>
          )}
        </div>
        <div className="relative">
          <div className="flex justify-between">
            <label className="text-sm text-gray-300">Password</label>
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <Eye className="size-4" />
              ) : (
                <EyeClosed className="size-4" />
              )}
            </button>
          </div>
          {errorMessages.password && (
            <p className="text-red-600 font-medium text-center text-sm">
              {errorMessages.password}
            </p>
          )}
        </div>
      </div>

      {errorMessages.general && (
        <p className="text-red-600 font-light text-center">
          {errorMessages.general}
        </p>
      )}

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full py-3 font-bold
                 bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4"
      >
        Log in
      </button>

      <p className="text-sm text-center text-gray-300 mb-4">
        Are you new in StudyZen?{' '}
        <Link
          to="/sign-up/"
          className="text-emerald-400 hover:underline hover:font-bold"
        >
          Sign up
        </Link>
      </p>

      <div className="flex items-center gap-4 justify-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </GoogleOAuthProvider>
        {/* <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
                <Twitter className="w-5 h-5" />
              </button> */}
      </div>
      <ToastContainer position="top-center" autoClose="1000" />
    </div>
  );
}
