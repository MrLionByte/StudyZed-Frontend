import { useState, useEffect } from "react";
import { Smile } from "lucide-react";
import api from "../../../../api/axios_api_call"
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from 'lucide-react';
import {savedAuthState, clearSavedAuthState} from '../../../../utils/Localstorage';
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/slice";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../../api/helpers/constrands";

export default function Studentlogin ({changeRole, passwordForgot}){
    // sample passwords = Pa$$w0rd!
    // unicorn4306@spinly.net
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter a valid email & password");
            return;
        };
        try {
            const role = "Student"
            const response = await api.post("auth-app/login/",{email, password});

            if (role.toLowerCase() !== (response['data']['role']).toLowerCase()){
                alert("You are not a student.");
                return false;
            }
            
            const authState = {
                accessToken: response.data["access_token"],
                refreshToken: response.data["refresh_token"],
                role: role,
                userId: response.data['user']['id'],
                firstName: response.data['user']['first_name'],
                lastName: response.data['user']['last_name'],
            }

            savedAuthState(authState);
            dispatch(setUser({user:response.data['user'], role: role}))
            localStorage.setItem(ACCESS_TOKEN, response.data['access_token']);
            localStorage.setItem(REFRESH_TOKEN, response.data['refresh_token']);
            alert('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
            navigate('/student/choose-session/');
        }
        catch (error) {
            console.log('ERROR :', error);
            alert("Failed to login. Please try again.");
        }
    };

    const handleSignup= () => {
        navigate('/sign-up/');
    };

    const handleRoleSelection = ( e ) => {
        e.preventDefault();
        changeRole();
    };

    const handleForgotPassword = ( e ) => {
        e.preventDefault();
        passwordForgot();
    };

    return (
        <>
        <div className="">
            <div className="bg-slate-100 flex justify-between items-stretch rounded">
                <button disabled
                className="text-white bg-gray-400 text-center rounded w-1/2 font-semibold">
                    STUDENT</button>
                <a href="#" onClick={handleRoleSelection}
                className="text-black w-1/2 text-center font-semibold">
                    TUTOR</a>
            </div>
        </div>
        <div className="mb-4">
           <label htmlFor="email" className="block text-sm font-medium text-gray-700">EMAIL</label>
             <input type="text" id="email" name="email" required value={email} autoComplete="on"
                onChange={(e) => {
                setEmail(e.target.value);}}  
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
        </div>
        <div className="mb-4 relative">
            <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 w-1/2">PASSWORD</label>
                <a href="#" onClick={handleForgotPassword} 
                className="text-sm text-blue-500 hover:underline">
                Forgot Password?
                </a>
            </div>

       
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 pr-10" // pr-10 adds padding for the button
            />

          
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute mt-5 inset-y-0 right-2 flex items-center text-black"
                aria-label="Toggle password visibility"
            >
                <p>{showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}</p>
            </button>
            </div>

           
            <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
            Login
            </button>

            <p className="text-black p-3">Don’t have an account ? <span type="button" onClick={handleSignup}
            className="text-blue-500 cursor-pointer hover:underline">Sign-up</span>  </p>

        {/* <button className="bg-black m-2 p-1" onClick={handleSample}>TEST</button> */}
    </>
    )
};

