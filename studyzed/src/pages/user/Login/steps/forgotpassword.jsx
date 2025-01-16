import { useState } from "react";
import api from "../../../../api/axios_api_call"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function ForgotPassword ({passwordForgot}) {

    const forgot_paragraph = "Forgot your account’s password? Enter your email address and we’ll send you a recovery OTP."
    const OTP_paragraph = "Confirm your email using the OTP sent to your Email, Enter the OTP below. Don't reload or close your browser."
    const password_paragraph = "Enter your new password here, don't reload or close your browser. Use a Capital, small, symbol and number"

    const [email, setEmail] = useState("");
    const [emailVarified, setEmailVarified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpVarified, setIsOtpVarified] = useState(false)
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Enter Email");
        try {
        const response = await api.post("auth-app/login/forgot-password/", {email});
        console.log("FORGOT PASSWORD",response.data['auth-status']);
        setEmailVarified(response.data['auth-status'])

        } catch (error) {
            console.log('Error :', error);
            console.log('Error :', error.response.data.error);
            toast.error(error.response.data.error)
        }
    };

    const handleOtp = async(e) => {
        e.preventDefault();
        if (!otp) return toast.error("Enter OTP");
        try {
            const response = await api.post('auth-app/login/forgot-password/otp-verify/', {email, otp});
            console.log("FORGOT OTP",response.data['auth-status']);
            setIsOtpVarified(response.data['auth-status'])
        } catch (error) {
            console.log(error.response.data);
            
            toast.error(error.response.data.message);
        }
    };

    const handleNewPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) return toast.warning("Enter new password");
        const errors = validate(newPassword);
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
              toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
            });
            return;
          }
        try {
            const response = await api.post('auth-app/login/forgot-password/change-password/', {email, new_password: newPassword});
            console.log("FORGOT NEW PASSWORD",response.data['auth-status']);
            toast.success("Password changed successfully")
            setTimeout(() => {
                passwordForgot();
            },1000)
        } catch (error) {
            console.log(error);    
            toast.error(error.response.data.message)
        }
    }

    const validate = (newPassword) => {
        const errors = {}
        if (!newPassword){
            errors.password = "Password is required.";
          } else if (newPassword.length < 8){
            errors.password = "Password must be at least 8 characters long. with upper, lower and number each atleast one";
          } else if (!/[A-Z]/.test(newPassword)) {
            errors.password = "Password must contain at least one uppercase letter.";
          } else if (!/[a-z]/.test(newPassword)) {
            errors.password = "Password must contain at least one lowercase letter.";
          } else if (!/[0-9]/.test(newPassword)) {
            errors.password = "Password must contain at least one number.";
          } else if (!/[!@#$%^&*]/.test(newPassword)) {
            errors.password = "Password must contain at least one special character (!@#$%^&*).";
          }
          return errors
    }

    return (
        <>
        <ToastContainer autoClose={1000} position="top-center" />
        {!emailVarified ? 
        <>
        <div className="mb-4">
            <p className="text-black mb-3">{forgot_paragraph}</p>

           <label htmlFor="email" className="block text-sm font-bold text-gray-700">
            EMAIL</label>
             <input type="text" id="email" name="email" required value={email} autoComplete="on"
                onChange={(e) => {
                setEmail(e.target.value);}}  
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
        </div>
        <div className="mb-4 relative">
           
            <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
            Send Recovery Mail
            </button>

        </div>
        </>
        : !isOtpVarified ? (
        <>
        <div className="mb-4">
            <p className="text-black mb-3">{OTP_paragraph}</p>

           <label htmlFor="email" className="block text-sm font-bold text-gray-700">
            OTP</label>
             <input type="text" id="otp" name="otp" required value={otp} autoComplete="off"
                onChange={(e) => {
                setOtp(e.target.value);}}  
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
        </div>
        <div className="mb-4 relative">
           
            <button
            type="submit"
            onClick={handleOtp}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
            Submit OTP
            </button>

        </div>
        </>) : (<>
            <div className="mb-4">
            <p className="text-black mb-3">{password_paragraph}</p>

           <label htmlFor="password" className="block text-sm font-bold text-gray-700">
            ENTER PASSWORD</label>
             <input type="password" id="password" name="password" required value={newPassword}
                onChange={(e) => {
                    setNewPassword(e.target.value);}}  
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
        </div>
        <div className="mb-4 relative">
           
            <button
            type="submit"
            onClick={handleNewPassword}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
            Change Password
            </button>

        </div>
        </>)}
        </>
    );
};