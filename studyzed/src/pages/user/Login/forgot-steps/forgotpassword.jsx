import { useState } from "react";
import api from "../../../../api/axios_api_call"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Test from "../../../../assets/test.svg";

export default function ForgotPassword ({passwordForgot}) {

    const forgot_paragraph = "Forgot your account’s password? Enter your email address and we’ll send you a recovery OTP."
    const otp_paragraph = "Confirm your email using the OTP sent to your Email, Enter the OTP below. Don't reload or close your browser."
    const password_paragraph = "Enter your new password here, don't reload or close your browser. Use a Capital, small, symbol and number"

    const [email, setEmail] = useState("");
    const [emailVarified, setEmailVarified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpVarified, setIsOtpVarified] = useState(false)
    const [newPassword, setNewPassword] = useState('');

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

    const handleChangeEmail = () => {
      setEmailVarified(false)
      setIsOtpVarified(false)
    }

    const handleBackToLogin = () => {
      passwordForgot()
    }

    return (
      <div className="flex-1 size-80">
        <div className="flex items-center gap-2 mb-4">
          <img src={Test} alt="Logo" className="w-14 h-14" />
          <h2 className="text-xl font-semibold">Forgot Password</h2>
        </div>
        {      
          !emailVarified ? (
            <p className="text-sm text-gray-300 mb-6">{forgot_paragraph}</p>
          ) : !isOtpVarified ? (
            
            <p className="text-sm text-gray-300 mb-6">{otp_paragraph}</p>
          ) : (
            
            <p className="text-sm text-gray-300 mb-6">{password_paragraph}</p>
          )
        }

  {!emailVarified ? (
    <>
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            value={email}
            autoComplete="on"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="relative">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Send Recovery Mail
          </button>
        </div>
      </div>
    </>
  ) : !isOtpVarified ? (
    <>
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-gray-300">OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            required
            value={otp}
            autoComplete="off"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="relative">
          <button
            type="submit"
            onClick={handleOtp}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Submit OTP
          </button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-gray-300">Enter Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 bg-gray-700/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="relative">
          <button
            type="submit"
            onClick={handleNewPassword}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  )}
  <div className="flex justify-between">

  <p className="text-end text-slate-400 hover:text-green-600 cursor-pointer" onClick={handleBackToLogin}>Back to login</p>
  {emailVarified &&
  <p className="text-end text-slate-400 hover:text-red-600 cursor-pointer" onClick={handleChangeEmail}>Change Email</p>
  }

  </div>
</div>

    );
};