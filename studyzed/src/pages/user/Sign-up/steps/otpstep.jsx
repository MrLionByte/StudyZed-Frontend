import { useEffect, useState } from "react";
import api from "../../../../api/axios_api_call";
import OTP_fields from "../../../../components/OTP_fields";

export default function otpstep ({onNext, onBack}) {
    const [otp, setOtp] = useState("");
    const [timeout, setTimeout] = useState(300); //seconds

    useEffect(() => {
        const storeTime = localStorage.getItem("otp-expire-timer");
        if (storeTime) {
            const timeRemaining = parseInt(storeTime, 10) - Date.now();
            if (timeRemaining > 0) {
                setTimeout(Math.floor(timeRemaining/1000));
            } else {
                setTimeout(0);
                localStorage.removeItem("otp-expire-timer");
            }
        } else {
            const expireTime = Date.now() + 5*60*1000;
            localStorage.setItem("otp-expire-timer", expireTime.toString());
        }

        const timerInterval = setInterval(()=>{
            setTimeout(prevTime => {
                const newTime = prevTime - 1;
                if (newTime <= 0){
                    clearInterval(timerInterval);
                    localStorage.removeItem("otp-expire-timer");
                }
                return newTime;
            });
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem("Temp_email");
            const response = await api.post('auth-app/verify-otp/', {email, otp}); 
            console.log('RESPONSE :', response);
                
            if (response.data['auth-status'] === 'success' && response.status === 200){
                localStorage.setItem("signup-step", 3);
                onNext(); }
            else {
                alert("Failed to verify OTP.", response.data['message']);
                }                
            } catch (error) {
                console.log('ERROR :', error)
                alert(error)
                throw error
            }     
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        
        try {
            const email = localStorage.getItem("Temp_email");
            const response = await api.post('auth-app/verify-otp/', {otp, email}); 
            console.log('RESPONSE :', response);
                
            if (response.data['auth-status'] === 'success' && response.status === 200){
                localStorage.setItem("signup-step", 3);
                onNext(); }
            else {
                alert("Failed to verify OTP.", response.data['message']);
                }                
            } catch (error) {
                console.log('ERROR :', error)
                alert(error)
                throw error
            }    
    };

    const handleBack = () => {
        localStorage.removeItem("Temp_email");
        localStorage.removeItem("signup-step");
        onBack();
    }

    const validateOTP = (otp) => {
        return /^\d{6}$/.test(otp);
    };
    
    const getOTP = (otpString) => {
            setOtp(otpString);
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
            <div className="mt-5">
                <p className="text-black">Enter OTP here :</p>
                <div className="mb-4 gap-2 flex items-center justify-center">
                
                    <OTP_fields otp_entered={getOTP} />                 
                
                </div>
                    {timeout > 0 ? (
                        <button 
                        type="submit" onClick={handleSubmit} 
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
                        >   Confirm OTP 
                        </button>
                    ) : <>
                        <button 
                        type="submit" onClick={handleResendOtp} 
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
                        >   Resend OTP 
                        </button>
                        </>
                    }

                <div className="text-center text-sm text-gray-700 p-2">
                    {timeout > 0 ? (
                        <p>Time Remaining: {formatTime(timeout)}</p>
                    ) : (
                        <p className="text-red-600">OTP Expired!</p>
                    )}
                </div>
                <div className="mt-5">
                    <a href="" className="text-black p-2 hover:text-red-600" onClick={handleBack}>
                        Want to change email ? </a>
                </div>
            </div>
    );
}