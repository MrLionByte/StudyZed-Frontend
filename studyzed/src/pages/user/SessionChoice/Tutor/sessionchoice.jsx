import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css'
import { useDispatch } from 'react-redux';
import {logout} from '../../../../redux/slice'

const TutorSessionPage = () => {
  const [isJoinSession, setIsJoinSession] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinSession = () => {
    setIsJoinSession(true); //
  };

  const SubmitSessionRequest = (e) => {
    
  };

  const handleUserRoundIcon= () => {
    navigate('/tutor/profile/')
  };

  const cancelSessionJoin = () => {
    setIsJoinSession(false);
  };

  const handleLogout = () => {
    console.log("LOGOUTINGG");
    
    dispatch(logout());
    navigate('/login/');
  };

  return (
    <div className="min-h-screen text-white">
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="text-lg font-bold">StudyZen</div>
        <ul className="flex space-x-8">
          <li><a href="#" className="hover:text-teal-300">Home</a></li>
          <li><a href="#" className="hover:text-teal-300">About Us</a></li>
          <li><a href="#" className="hover:text-teal-300">FAQ</a></li>
        </ul>
        <div className="flex items-center justify-between gap-6">
          <CircleUserRound className='cursor-pointer' onClick={handleUserRoundIcon}/>
          <div className='space-y-1'>
          {/* <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span> */}
          <button className='bg-red-900 rounded p-2 cursor-pointer' onClick={handleLogout}>LOG-OUT</button>
          </div>
        </div>
      </nav>

      {(!isJoinSession) ? <>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
          <p className="text-xl font-semibold">Session By:</p>
          <p className="text-lg">Yor</p>
          <p className="text-xl font-semibold mt-4">Session:</p>
          <p className="text-lg">EEE</p>
        </div>
      </div>

      <div className='flex items-center justify-center'>
       <button className='default_button p-3' 
       onClick={handleJoinSession} >
        CREATE NEW SESSION</button>
      </div>
      </>     : 
      <>
        <div className="flex justify-center items-center min-h-[80vh]">
        <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md flex">
          <form action="" className='flex justify-center '>
            <label htmlFor="session-d" className='font-bold text-xl m-2'>Enter Session ID :</label>
            <input type="text" id='session-id' className='text-green-900 rounded p-2 ml-3' placeholder='XXXXX-XXXX' />
                  <div class="icon-container">
        <ArrowRight class="size-8 m-1 ml-3" onClick={SubmitSessionRequest} />
        <div class="tooltip">Submit</div>
      </div>
      <p onClick={cancelSessionJoin}
       className='p-1 bg-red-500 rounded-xl m-1'>Cancel</p>  
          </form>
        </div>
        </div>
      </>
      }
      </div>
  );
};

export default TutorSessionPage;
