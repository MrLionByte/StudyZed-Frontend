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

  const itemsPerPage = 12;

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
  const handleUserRoundIcon = () => {
    navigate('/tutor/profile/');
  };

  const cancelSessionJoin = () => {
    setIsJoinSession(false);
  };

  const handleLogout = () => {
    console.log('LOGOUTINGG');

    dispatch(logout());
    navigate('/login/');
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

  return {
    fetchSessionsData
  }
}