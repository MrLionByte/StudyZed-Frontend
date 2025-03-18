import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../redux/slice';
import CreateNewSession from './components/create_session_card';
import Navbar from '../components/navbar';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import { getSavedAuthData } from '../../../../utils/Localstorage';
import { TutorEndPoints } from '../../../../api/endpoints/userEndPoints';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import {
  GraduationCap,
  Clock,
  Users,
  PlusCircleIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

const TutorSessionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinSession, setIsJoinSession] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tutorCode, setTutorCode] = useState('');
  const [error, setError] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [isPaid, setIsPaid] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const itemsPerPage = 8;

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEnterSession = (e, tutor_code, session_code, is_approved) => {
    e.preventDefault();
    const sessionData = {
      tutor_code: tutor_code,
      session_code: session_code,
    };
    if (tutor_code && is_approved) {
      navigate('/tutor/enter-session/', { state: { sessions: sessionData } });
    } else if (!is_approved) {
      toast.warning('Please wait, admin need to approve this.');
    }
  };

  const handlePayForUnpaidSession = () => {
    e.preventDefault();
  };

  const handleCopyCode = (code) => {
    console.log('Code to copy:', code);
    if (!code) {
      toast.error('Invalid code to copy.');
      return;
    }
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedId(code);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error('Clipboard error:', err);
        toast.error('Failed to copy code.');
      });
  };

  async function fetchSessionsData(cursor = null) {
    const tutor_data = getSavedAuthData();
    setTutorCode(tutor_data?.user_code);
    const queryData = { tutor_code: tutor_data?.user_code };

    setLoading(true);
    const decodedCursor = decodeURIComponent(cursor);
    if (cursor) {
      queryData.cursor = decodedCursor;
    };

    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(TutorEndPoints.TutorSessions, {
        baseURL: url,
        params: queryData,
      });

      setSessions(response?.data?.results);
      setNextPage(response?.data?.next);
      setPrevPage(response?.data?.previous);
      console.log('RESPONSE BRUT', response.data);
      console.log('RESPONSE BRUT', response);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.error('Error :', e);
    }
  }

  useEffect(() => {
    if (fetchFromBackend) {
      fetchSessionsData();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const bg_image =
    'https://img.freepik.com/free-photo/back-school-witch-school-supplies_23-2148151036.jpg?t=st=1738668597~exp=1738672197~hmac=103229c509cd3cf9de122633137ff9fd612fa133f5bee4e8335c820b73e856ca&w=900';

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex items-center justify-end mt-4">
        <button className="hidden md:block p-3 border-2 rounded-2xl hover:bg-emerald-400 hover:text-black hover:border-black font-sans" onClick={openModal}>
          CREATE NEW SESSION
        </button>
        <button className="md:hidden p-1 rounded-2xl hover:bg-emerald-400 hover:text-black hover:border-black font-sans" onClick={openModal}>
          <PlusCircleIcon />
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 p-4">
        {sessions?.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="relative group rounded-xl border border-x-yellow-500
        overflow-hidden h-60 hover:transform hover:scale-105 
        transition-all duration-300"
            >
              {/* Card Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-slate-400"
                style={{ backgroundImage: `url(${session.image || bg_image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

              <div className="relative p-3 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-sm font-medium">
                      {session.session_code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(session.session_code)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title="Copy session code"
                    >
                      {copiedId === session.session_code ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <span className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                    {session.session_name}
                  </span>
                </div>

                <h3 className="text-white text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                  {session.session_name}
                </h3>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                    <span className='mr-1 text-rose-400 font-bold'>{session.days_left} </span><span>Days Left</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-emerald-400" />
                    <span>{session.student_count} Students</span>
                  </div>

                  <button
                    onClick={(e) =>
                      handleEnterSession(
                        e,
                        session.tutor_code,
                        session.session_code,
                        session.is_active,
                      )
                    }
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Enter Session
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">No sessions available</p>
        )}
      </div>



      <div className="flex justify-center mt-4 bg-red-400"></div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <CreateNewSession cancelModal={closeModal} />
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
