import { useState } from 'react';
import Login from './login-steps/login.jsx';
import ForgotPassword from './forgot-steps/forgotpassword.jsx';
import LoginPic from '../../../assets/loginpic.png';

export default function Signin() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleForgotPassword = () => {
    setIsForgotPassword((prev) => !prev);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[800px] 3xl:w-[1200px] flex gap-8">
        {!isForgotPassword ? (
          <>
            <Login passwordForgot={handleForgotPassword} />
          </>
        ) : (
          <>
            <ForgotPassword passwordForgot={handleForgotPassword} />
          </>
        )}

        <div className="hidden md:flex-1 md:justify-center items-end md:bg-opacity-10 md:bg-slate-400 md:rounded-xl md:overflow-hidden md:block relative">
          <img
            src={LoginPic}
            alt="Study"
            className="absolute bottom-[-10%] left-1/2 transform -translate-x-1/2 scale-90 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
