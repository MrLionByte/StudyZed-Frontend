import { useState } from "react";
import api from "../../../../api/axios_api_call.js"
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from 'lucide-react';
import { savedAuthData } from "../../../../utils/Localstorage.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/slice.js";
import {toast, ToastContainer} from "react-toastify";

// import Tutorlogin from "./steps/tutor.jsx";
// import ForgotPassword from "./steps/forgotpassword.jsx";
import LoginPic from "../../../../assets/loginpic.png";
import LogoSvg from "../../../../assets/test.svg";
import { useSelector } from "react-redux";
import { Github, Twitter } from 'lucide-react';


export default function TutorStudentlogin ({ passwordForgot }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errorCaught, setErrorCaught] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorCaught("Please enter a valid email & password");
            return;
        };

        setLoading(true);
        setErrorCaught('');

        try {
            const response = await api.post("auth-app/login/",{email, password});
            
            console.log("TOAST :", response);
            const { access_token, refresh_token, user, role, user_code } = response.data;
            const authState = {
                accessToken: access_token,
                refreshToken: refresh_token,
                user: user,
                role: role,
                user_code: user_code,
                isAuthenticated: true,
              };
            
            savedAuthData(authState);
            dispatch(setUser({user, role}));
            
            toast.success(`LOGIN SUCCESSFUL. Welcome ${user.first_name}`);
            
            setTimeout(() => {
              const redirectPath = role === "STUDENT" ? "/student/choose-session/" : "/tutor/choose-session/";
              navigate(redirectPath);
            }, 2500);
            // if (role === 'STUDENT'){
            //   setTimeout(()=>{
            //       navigate('/student/choose-session/');
            //   }, 2000);
            // } else if (role === 'TUTOR'){
            //   setLoading(false)
            //   toast.success('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
            //   setTimeout(()=>{
            //     setLoading(true)
            //     navigate('/tutor/choose-session/');
            // }, 2000);
            // } else {
            //   toast.error('ERROR')
            // }
            
            
        }
        catch (error) {
            const auth_status = error.response.data.errors["auth-status"]?.[0] || "unknown"
            console.log('ERROR :', auth_status, error);
            if (auth_status === "user-notexsist") {
              setEmailError('This mail is not registered here.');
              // setPasswordError('')
            } else if (error.response.data["auth-status"] === "user-notexsist") {
              setEmailError('This user is not registered here.');
            } else if (auth_status === "password-failed"){
              // setEmailError('')
              setPasswordError("Your password is incorrect. Try again or try forgot password")
            } else if (auth_status === "user-blocked"){
              // setEmail('')
              // setPasswordError('')
              toast.error("You have been blocked,try to contact admin");
            } else{
              // setEmail('')
              // setPasswordError('')
              toast.error("Failed to login. Please try again.");
            }
        } finally {
          setLoading(false)
        }
    };

    const handleForgotPassword = ( e ) => {
        e.preventDefault();
        passwordForgot();
    };

    return (
   
        <div className="flex-1">

        {loading && 
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
            <img 
              src={LogoSvg} 
              alt="Loading" 
              className="w-64 h-64 animate-pulse"
            />
        </div>
        } 
            <div className="flex items-center gap-2 mb-4">
              <Link to="/">
                <img src={LogoSvg} alt="Logo" className="w-14 h-14" />
              </Link>
              <h2 className="text-xl font-semibold">Get Started</h2>
            </div>
            <p className="text-sm text-gray-300 mb-6">Welcome back to StudyZed! Let's create future</p>
            
  
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-300">Username / Email</label>
                
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={(e) => {setEmail(e.target.value);}} 
                  className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <p className="text-red-600 font-medium text-center">{emailError}</p>
              </div>
              <div className="relative">
                <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Password</label>
                    <a href="#" onClick={handleForgotPassword}
                    className="text-sm text-blue-500 hover:underline">
                    Forgot Password?
                    </a>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
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
                        {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                    </button>
                </div>
                <p className="text-red-600 font-medium text-center text-sm">{passwordError}</p>
            </div>

                    
            </div>
            <p className="text-red-600 font-light text-center">{errorCaught}</p>
            <button 
                type="submit"
                onClick={handleSubmit}
                className="w-full py-3 font-bold
                 bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4">
              Log in
            </button>
  
            <p className="text-sm text-center text-gray-300 mb-4">
              Are you new in StudyZen? {' '}
              <Link to="/sign-up/" className="text-emerald-400 hover:underline hover:font-bold">
                Sign up
              </Link>
            </p>
  
            <div className="flex items-center gap-4 justify-center">
              {/* <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
                <Twitter className="w-5 h-5" />
              </button> */}
            </div>
            <ToastContainer  position="top-center" autoClose='1000' />
          </div>

    )
};

