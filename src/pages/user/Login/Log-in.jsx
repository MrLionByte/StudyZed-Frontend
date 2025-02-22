import { useState, useEffect } from 'react';
import { Smile } from 'lucide-react';
// import Tutorlogin from "./steps/tutor.jsx";
import Login from './login-steps/login.jsx';
import ForgotPassword from './forgot-steps/forgotpassword.jsx';
import LoginPic from '../../../assets/loginpic.png';
import Test from '../../../assets/test.svg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSavedAuthData } from '../../../utils/Localstorage.js';
import { Github, Twitter } from 'lucide-react';

export default function Signin() {
  const [student, setstudent] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const navigate = useNavigate();

  const handleTutorRole = () => {
    setstudent((prev) => {
      return !prev;
    });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword((prev) => !prev);
  };

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // useEffect(() => {
  //   try{
  //     const role = getSavedAuthData();
  //       console.log("ROLE :", role.role.toLowerCase());
  //     if (isAuthenticated) {
  //       navigate(`/${role.role.toLowerCase()}/choose-session/`);
  //     }
  //     }catch (error) {
  //       return;
  //     }
  // }, [isAuthenticated, navigate, student])
  console.log('student :', student);

  // return (
  //     <>
  //     <div className="flex justify-center items-center min-h-screen ">
  //       <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg">
  //         <div className='bg-white  flex'>

  //           <div className="w-1/2 p-8">
  //               <h2 className="text-2xl font-bold text-black text-center mb-6">Login</h2>

  //               <form>
  //               { !isForgotPassword ?
  //               <>
  //                 { student && <Studentlogin changeRole={handleTutorRole} passwordForgot={handleForgotPassword} /> }
  //                 { !student && <Tutorlogin changeRole={handleTutorRole} passwordForgot={handleForgotPassword} /> }
  //               </>
  //               :
  //               <>
  //                 <ForgotPassword passwordForgot={handleForgotPassword}/>
  //               </>}
  //               </form>
  //           </div>

  //           <div className="w-1/2 flex rounded items-center justify-center bg-gray-100">
  //             <div className='w-[95%] h-[95%] bg-white rounded p-1'>
  //               <img
  //                   src={ LoginPic }
  //                   alt="Placeholder"
  //                   className="object-cover rounded h-full w-full"
  //               />
  //             </div>
  //           </div>

  //       </div>
  //     </div>
  //   </div>
  // </>
  // )
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[800px] flex gap-8">
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
