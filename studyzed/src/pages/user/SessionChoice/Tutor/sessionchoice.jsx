import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css'
import { useDispatch } from 'react-redux';
import {logout} from '../../../../redux/slice'
import CreateNewSession from './components/create_session_card'
import Navbar from '../components/navbar';
import api,{api_dictnory} from '../../../../api/axios_api_call';
import { getSavedAuthData } from '../../../../utils/Localstorage';
import { TutorEndPoints } from '../../../../api/endpoints/userEndPoints';
import { toast, ToastContainer, Bounce } from 'react-toastify';

const TutorSessionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinSession, setIsJoinSession] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [fetchFromBackend, setFetchFromBackend] = useState(true)
  const [loading, setLoading] = useState(false)
  const [tutorCode, setTutorCode] = useState('')
  const [error, setError] = useState(false)
  const [sessions, setSessions] = useState([])
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinSession = () => {
    setIsJoinSession(true); //
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleEnterSession = (e,tutor_code, session_code, is_approved) =>{
    e.preventDefault();
    const sessionData = { 
      tutor_codee: tutor_code, session_code: session_code
    }
    if (tutor_code && is_approved){
      navigate("/tutor/enter-session/", { state: { sessions: sessionData } });
    } else if (!is_approved){
      toast.warning("Please wait, admin need to approve this.")
    }
    
  }

  useEffect(()=> {
    const tutor_data = getSavedAuthData()
    
    setTutorCode(tutor_data.user_code)

    async function fetchSessionsData () {
        setLoading(true);
        
        console.log(tutor_data.user_code);
        const qury_data = {"tutor_code": tutor_data.user_code}
        try {
            const url = api_dictnory["Session_Service"]
            const response = await api.get(TutorEndPoints.TutorSessions, {
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

    <div className="flex justify-center items-center min-h-[80vh]">
    {sessions?.length > 0 ? (
        sessions.map((session, index) => (
          <div
            key={index}
            className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md cursor-pointer"
          >
            <p className="text-xl font-semibold mt-4">Session Name:</p>
            <p className="text-lg">{session.session_name || "Unnamed"}</p>
            <button onClick={(e)=>handleEnterSession(e,session.tutor_code, session.session_code, session.is_active)} 
            className='bg-blue-800 text-center rounded p-2 hover:bg-green-700'>Enter Session</button>
          </div>
        ))
      ) : (
        <p className="text-white text-lg">No sessions available</p>
      )}
    </div>

    <div className="flex items-center justify-center">
      <button className="default_button p-3" onClick={openModal}>
        CREATE NEW SESSION
      </button>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateNewSession cancelModeal={closeModal} />
      </div>
    )}

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

export default TutorSessionPage;
