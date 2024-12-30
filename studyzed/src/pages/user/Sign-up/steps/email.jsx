import { useEffect, useState } from "react";
import api from "../../../../api/axios_api_call";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify'

export default function emailstep ( {onNext} ) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("Temp_email");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting){
            toast.info("Please wait, your initail request has been loading")
            return
        }
        if (!email){toast.warning("Please enter a valid email")}
        else {
            if (!validateEmail(email)) {
                toast.warning('Please enter a valid email address.');
                return;
            }
            try {
                setSubmitting(true);
                const response = await api.post('auth-app/user-email/', {email}); 
                console.log('RESPONSE :', response);
                console.log('RESPONSE :', response['auth-status']);
                console.log("Browser cookies:", document.cookie);
                localStorage.setItem('Temp_email', email);
                setSubmitting(false);
                if (response.data['auth-status'] === 'success' && response.status === 200){
                onNext();
                localStorage.removeItem("otp-expire-timer"); 
            }
                else {
                    setSubmitting(false);
                    toast.error('Failed to send OTP. Please try again.');
                }
            }
            catch (error){
                setSubmitting(false);
                console.log('ERROR :', error)
                if (error.status== 400 ){
                    setSubmitting(false);
                    toast.error("Email is already in use. Please try with a different email address")
                }else {
                    setSubmitting(false);
                    console.log("Email :",error)
                toast.error('Error occurred, try again later')
            }
                throw error
            }
        }     
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
    
    
    const handleSignin = () => {
        navigate('/login'); 
    }

    return (
        <>
        <div className="mt-5">
            <div className="mb-4">
               <label htmlFor="username" className="block text-sm font-medium text-gray-700">EMAIL</label>
                 <input type="text" id="email" name="email" required value={email} placeholder="Enter your Email"
                    onChange={(e) => {
                    setEmail(e.target.value); localStorage.setItem('Temp_email', e.target.value); }}  
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
            </div>
            <button 
                type="submit" onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
                > Verify Email </button>
            <p className="text-black mt-5">Already have account ? 
                <span className="text-red-600 cursor-pointer hover:underline" onClick={handleSignin}>Sign-in</span>
            </p>
        </div>
        <ToastContainer autoClose='1000' position="top-center"/>
        </>
    )
}