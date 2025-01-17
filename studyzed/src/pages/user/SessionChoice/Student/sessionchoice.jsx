import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css'
import { useDispatch } from 'react-redux';
import {logout} from '../../../../redux/slice'
import { clearSavedAuthData, getSavedAuthData } from '../../../../utils/Localstorage';
import api, {api_dictnory} from '../../../../api/axios_api_call';
import {studentEndPoints} from '../../../../api/endpoints/userEndPoints';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import Navbar from '../components/navbar.jsx';

const SessionPage = () => {
  const [isJoinSession, setIsJoinSession] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [fetchFromBackend, setFetchFromBackend] = useState(true)
  const [loading, setLoading] = useState(false)
  const [studentCode, setStudentCode] = useState('')
  const [error, setError] = useState(false)
  const [sessions, setSessions] = useState([])

  const [tutorData, setTutorData] = useState({})

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinSession = () => {
    setIsJoinSession(true); //
  };
  
  const SubmitSessionRequest = async(e) => {
    e.preventDefault();
    try {
      const enter_data = {
        "student_code": studentCode,
        "session_code": sessionCode,
      }
      
      console.log("Payload being sent:", enter_data);

      const url = api_dictnory["Session_Service"]
      const response = await api.post(studentEndPoints.ChooseSession,
        enter_data,{ 
        baseURL: url,
    });
    if (response.status === 201){
      toast.success("Successfully Joined the session")
      setIsJoinSession(false)
    }
    console.log("RESPONSE JOIN :",response);
    
    } catch (error) {
      if (error.response.data.error === 'exsist'){
        toast.warning("You are already part of the session")
      } else if (error.response.data.error === 'not_approved'){
        toast.warning("This ession is yet to be approved")
      } 
      else {
      console.error("Error while submitting session request:", error.response || error);
      toast.error("The given session code doesnot exsist. Give a valid one")
      }
    }

    setFetchFromBackend(true)
  };

  const handleUserRoundIcon= () => {
    navigate('/student/student-profile/')
  };

  const cancelSessionJoin = () => {
    setIsJoinSession(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    clearSavedAuthData()
    navigate('/login/');
    console.log("wadadasd");
    
  };

  const handleEnterSession = (e,tutor_code, session_code, is_approved) =>{
    e.preventDefault();
    const sessionData = { 
      tutor_codee: tutor_code, session_code: session_code
    }
    if (tutor_code && is_approved){
      navigate("/student/enter-session/", { state: { sessions: sessionData } });
    } else if (!is_approved){
      toast.warning("Please wait, your tutor need to approve this.")
    }
    
  }

  useEffect(()=> {
    const student_data = getSavedAuthData()
    console.log(student_data.user_code);
    
    setStudentCode(student_data.user_code)

    async function fetchSessionsData () {
        setLoading(true);
        
        console.log(student_data.user_code);
        const qury_data = {"student_code": student_data.user_code}
        try {
            const url = api_dictnory["Session_Service"]
            const response = await api.get(studentEndPoints.AllSessions, {
                baseURL: url,
                params : qury_data
            });
            
            setSessions(response.data);
            console.log("RESPONSE BRUT",response.data)
            console.log("RESPONSE BRUT",response)
        } catch (e) {
            setError(e);
            setLoading(false);
            console.error("Error :", e);
        }
    };
    
    if (fetchFromBackend){
        fetchSessionsData();
        setFetchFromBackend(false);
    }
  } ,[fetchFromBackend]);

  return (
    <div className="min-h-screen text-white">
      <Navbar logout={handleLogout} userProfile={handleUserRoundIcon} />
      {/* <nav className="flex justify-between items-center px-8 py-4">
        <div className="text-lg font-bold">StudyZen</div>
        <ul className="flex space-x-8">
          <li><a href="#" className="hover:text-teal-300">Home</a></li>
          <li><a href="#" className="hover:text-teal-300">About Us</a></li>
          <li><a href="#" className="hover:text-teal-300">FAQ</a></li>
        </ul>
        <div className="flex items-center justify-between gap-6">
          <CircleUserRound className='cursor-pointer' onClick={handleUserRoundIcon}/>
          <div className='space-y-1'> */}
          {/* <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span> */}
          {/* <button className='bg-red-900 rounded p-2 cursor-pointer' onClick={handleLogout}>LOG-OUT</button>
          </div>
        </div>
      </nav> */}

      {(!isJoinSession) ? <>
        <div className="flex flex-wrap justify-center items-center gap-4 min-h-[80vh]">
      {sessions?.length > 0 ? (
        sessions.map((session, index) => (
          <div
            key={index}
            className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md cursor-pointer"
          >
            <p className="text-xl font-semibold">Session By:</p>
            <p className="text-lg">{session.tutor_code || "Unknown"}</p>
            <p className="text-xl font-semibold mt-4">Session Name:</p>
            <p className="text-lg">{session.session_name || "Unnamed"}</p>
            <button onClick={(e)=>handleEnterSession(e,session.tutor_code, session.session_code, session.is_allowded)} 
            className='bg-blue-800 text-center rounded p-2 hover:bg-green-700'>Enter Session</button>
          </div>
        ))
      ) : (
        <p className="text-white text-lg">No sessions available</p>
      )}
    </div>

      <div className='flex items-center justify-center'>
       <button className='default_button p-3' 
       onClick={handleJoinSession} >
        JOIN SESSION</button>
      </div>
      </>     : 
      <>
        <div className="flex justify-center items-center min-h-[80vh]">
        <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md flex">
          <form action="" className='flex justify-center '>
            <label htmlFor="session-d" className='font-bold text-xl m-2'>Enter Session ID :</label>
            <input onChange={(e) => setSessionCode(e.target.value)} maxLength={15}
            type="text" id='session-id' className='text-green-900 rounded p-2 ml-3' placeholder='XXXXX-XXXX' />
                  <div className="icon-container">
        <ArrowRight className="size-8 m-1 ml-3 cursor-pointer" onClick={SubmitSessionRequest} />
        <div className="tooltip">Submit</div>
      </div>
      <p onClick={cancelSessionJoin}
       className='p-1 bg-red-500 rounded-xl m-1'>Cancel</p>  
          </form>
        </div>
        </div>
      </>
      }

              <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                className="toast-center"
              />

      </div>
  );
};

export default SessionPage;
