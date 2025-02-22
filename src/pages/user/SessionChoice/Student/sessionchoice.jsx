import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../redux/slice';
import {
  clearSavedAuthData,
  getSavedAuthData,
} from '../../../../utils/Localstorage';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../api/endpoints/userEndPoints';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import Navbar from '../components/navbar.jsx';

const SessionPage = () => {
  const [isJoinSession, setIsJoinSession] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [tutorData, setTutorData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinSession = () => {
    setIsJoinSession(true); //
  };

  const SubmitSessionRequest = async (e) => {
    e.preventDefault();
    try {
      const enter_data = {
        student_code: studentCode,
        session_code: sessionCode,
      };

      console.log('Payload being sent:', enter_data);

      const url = API_BASE_URLS['Session_Service'];
      const response = await api.post(
        studentEndPoints.ChooseSession,
        enter_data,
        {
          baseURL: url,
        },
      );
      if (response.status === 201) {
        toast.success('Successfully Joined the session');
        setIsJoinSession(false);
      }
      console.log('RESPONSE JOIN :', response);
    } catch (error) {
      if (error.response.data.error === 'exsist') {
        toast.warning('You are already part of the session');
      } else if (error.response.data.error === 'not_approved') {
        toast.warning('This ession is yet to be approved');
      } else {
        console.error(
          'Error while submitting session request:',
          error.response || error,
        );
        toast.error('The given session code doesnot exsist. Give a valid one');
      }
    }

    setFetchFromBackend(true);
  };

  const cancelSessionJoin = () => {
    setIsJoinSession(false);
  };

  const handleEnterSession = (e, tutor_code, session_code, is_approved) => {
    console.log(tutor_code, session_code);

    e.preventDefault();
    const sessionData = {
      tutor_code: tutor_code,
      session_code: session_code,
    };
    if (tutor_code && is_approved) {
      navigate('/student/enter-session/', { state: { sessions: sessionData } });
    } else if (!is_approved) {
      toast.warning('Please wait, your tutor need to approve this.');
    }
  };

  async function fetchSessionsData() {
    const student_data = getSavedAuthData();

    if (student_data?.user_code) {
      setStudentCode(student_data.user_code);
    } else {
      clearSavedAuthData();
      return;
    }

    setLoading(true);

    console.log(student_data?.user_code);
    const qury_data = { student_code: student_data?.user_code };

    if (!qury_data) {
      clearSavedAuthData();
      navigate('/login/');
    }

    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(studentEndPoints.AllSessions, {
        baseURL: url,
        params: qury_data,
      });

      setSessions(response.data);
      console.log('RESPONSE BRUT', response?.data);
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

      {!isJoinSession ? (
        <>
          <div className="flex flex-col items-center align-middle mt-4">
            <button className="default_button p-3" onClick={handleJoinSession}>
              JOIN SESSION
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 p-4">
            {sessions?.length > 0 ? (
              sessions.map((session, index) => (
                <div
                  key={session.id || index}
                  className="relative group rounded-xl border border-x-yellow-500
        overflow-hidden h-[220px] hover:transform hover:scale-105 
        transition-all duration-300"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-slate-400"
                    style={{
                      backgroundImage: `url(${session.image || bg_image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                  <div className="relative p-3 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-sm font-medium">
                          {session.session_code}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-white text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                      {session.session_name}
                    </h3>

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center text-gray-300">
                        <GraduationCap className="w-5 h-5 mr-2 text-emerald-400" />
                        <span>{session.instructor || session.tutor_code}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-5 h-5 mr-2 text-emerald-400" />
                        {/* <span>{session.students} Students</span> */}
                      </div>

                      <button
                        onClick={(e) =>
                          handleEnterSession(
                            e,
                            session.tutor_code,
                            session.session,
                            session.is_allowded,
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
        </>
      ) : (
        <>
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md flex">
              <form action="" className="flex justify-center ">
                <label htmlFor="session-d" className="font-bold text-xl m-2">
                  Enter Session ID :
                </label>
                <input
                  onChange={(e) => setSessionCode(e.target.value)}
                  maxLength={15}
                  type="text"
                  id="session-id"
                  className="text-green-900 rounded p-2 ml-3"
                  placeholder="XXXXX-XXXX"
                />
                <div className="icon-container">
                  <ArrowRight
                    className="size-8 m-1 ml-3 cursor-pointer"
                    onClick={SubmitSessionRequest}
                  />
                  <div className="tooltip">Submit</div>
                </div>
                <p
                  onClick={cancelSessionJoin}
                  className="p-1 bg-red-500 rounded-xl m-1"
                >
                  Cancel
                </p>
              </form>
            </div>
          </div>
        </>
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

export default SessionPage;
