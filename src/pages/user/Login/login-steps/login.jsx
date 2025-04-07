import { useState } from 'react';
import api from '../../../../api/axios_api_call.js';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import { savedAuthData } from '../../../../utils/Localstorage.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../redux/slice.js';
import { toast, ToastContainer } from 'react-toastify';
import LogoSvg from '../../../../assets/test.svg';
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
      case 'validation-failed':
        return { email: 'This email or username is not registered.' };
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
      if (error.status === 429) {
        toast.error(
          'You are blocked temporarily due to too many invalid attempts, try again later',
        );
      } else {
        const authStatus =
          error.response?.data?.errors['auth-status']?.[0] ||
          error.response?.data['auth-status'] ||
          'unknown';
        const errorMessage = getErrorMessages(authStatus);
        setErrorMessages(errorMessage);
      }
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
    const decoded = jwtDecode(token);
    let user_name = decoded.name.replace(/\s/g, '_');

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
        navigate(`/${role_location}/choose-session/`);
      } else if (response.data['auth-status'] === 'blocked') {
        toast.error('Your account is blocked. Contact the admin.');
      } else {
        toast.error('Some error occurred try after some time.');
      }
    } catch (error) {
      setErrorMessages('Error occurred, try again later');
    }
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
      <form onSubmit={handleSubmit}>
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
              <p className="text-red-600 font-medium text-center bg-opacity-25">
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
                className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center text-gray-200"
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
              <p className="text-red-600 font-medium text-center text-sm bg-opacity-25">
                {errorMessages.password}
              </p>
            )}
          </div>
        </div>

        {errorMessages.general && (
          <p className="bg-red-400 bg-opacity-25 rounded-lg font-light text-center text-error">
            {errorMessages.general}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full py-3 font-bold
                 bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
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
          <GoogleLogin onSuccess={responseMessage} onError={errorMessages || ''} />
        </GoogleOAuthProvider>
      </div>
      <ToastContainer position="top-center" autoClose="1000" />
    </div>
  );
}
