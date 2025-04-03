import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getSavedAuthData, clearSavedAuthData } from '../../../../utils/Localstorage';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../api/endpoints/userEndPoints';

export const useStudentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [sessionCode, setSessionCode] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const navigate = useNavigate();

  const openJoinModal = () => {
    setIsJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    setSessionCode('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    filterSessions(tab, sessions);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleEnterSession = (tutorCode, sessionCode, isApproved) => {
    if (tutorCode && isApproved) {
      const sessionData = {
        tutor_code: tutorCode,
        session_code: sessionCode
      };
      navigate('/student/enter-session/', { state: { sessions: sessionData } });
    } else if (!isApproved) {
      toast.warning('Please wait, your tutor needs to approve this session.');
    }
  };

  const filterSessions = (tab, sessionsData) => {
    if (sessionsData.length > 0) {
      // Filter based on is_allowded status
      const filtered = tab === 'active'
        ? sessionsData.filter(session => session.is_allowded === true)
        : sessionsData.filter(session => session.is_allowded === false);
      
      setFilteredSessions(filtered);
      
      // Calculate total pages
      const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
      setTotalPages(pages);
      
      // Reset to page 1 if current page exceeds new total
      if (currentPage > pages) {
        setCurrentPage(1);
      }
    } else {
      setFilteredSessions([]);
      setTotalPages(1);
    }
  };

  const submitSessionRequest = async (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) {
      toast.error('Please enter a valid session code');
      return;
    }

    setLoading(true);
    try {
      const enterData = {
        student_code: studentCode,
        session_code: sessionCode,
      };

      const url = API_BASE_URLS['Session_Service'];
      const response = await api.post(
        studentEndPoints.ChooseSession,
        enterData,
        {
          baseURL: url,
        }
      );
      
      if (response.status === 201) {
        toast.success('Successfully joined the session');
        closeJoinModal();
        fetchSessions();
      }
    } catch (error) {
      if (error.response?.data?.error === 'exsist') {
        toast.warning('You are already part of this session');
      } else if (error.response?.data?.error === 'not_approved') {
        toast.warning('This session is yet to be approved');
      } else {
        toast.error('Invalid session code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    const studentData = getSavedAuthData();

    if (!studentData?.user_code) {
      clearSavedAuthData();
      navigate('/login/');
      return;
    }

    setStudentCode(studentData.user_code);
    setLoading(true);

    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(studentEndPoints.AllSessions, {
        baseURL: url,
        params: { student_code: studentData.user_code },
      });

      // Store all sessions
      setSessions(response.data);
      
      // Apply filtering based on current active tab
      filterSessions(activeTab, response.data);
      
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast.error('Failed to load sessions');
    }
  };

  useEffect(() => {
   if (fetchFromBackend){
    fetchSessions();
    setFetchFromBackend(false)
    }
  }, []);

  // Get paginated sessions
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return {
    sessions: paginatedSessions,
    allSessions: sessions,
    loading,
    error,
    isJoinModalOpen,
    sessionCode,
    activeTab,
    currentPage,
    totalPages,
    openJoinModal,
    closeJoinModal,
    handleEnterSession,
    handleTabChange,
    handlePageChange,
    setSessionCode,
    submitSessionRequest,
    fetchSessions
  };
};