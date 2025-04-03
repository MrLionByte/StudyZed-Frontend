import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import { getSavedAuthData } from '../../../../utils/Localstorage';
import { TutorEndPoints } from '../../../../api/endpoints/userEndPoints';

export const useTutorSessions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tutorCode, setTutorCode] = useState('');
  const [error, setError] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const ITEMS_PER_PAGE = 9;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all sessions initially
  useEffect(() => {
    fetchSessionsData();
  }, []);

  // Filter and paginate sessions based on active tab and current page
  useEffect(() => {
    if (allSessions.length > 0) {
      const filteredSessions = allSessions.filter(session => {
        if (activeTab === 'active') {
          return session.days_left > 0;
        } else {
          return session.days_left <= 0;
        }
      });
      
      const total = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
      setTotalPages(total || 1);
      
      // Adjust current page if it exceeds total pages
      if (currentPage > total) {
        setCurrentPage(total || 1);
      }
      
      // Paginate the filtered sessions
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedSessions = filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setSessions(paginatedSessions);
    }
  }, [allSessions, activeTab, currentPage]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Refresh data when modal closes
    fetchSessionsData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEnterSession = (e, tutor_code, session_code, days_left, is_approved) => {
    e.preventDefault();
    
    if (days_left <= 0) {
      toast.error('This session has expired.');
      return;
    }
    
    const sessionData = {
      tutor_code: tutor_code,
      session_code: session_code,
      days_left: days_left,
    };
    
    if (tutor_code && is_approved) {
      navigate('/tutor/enter-session/', { state: { sessions: sessionData } });
    } else if (!is_approved) {
      toast.warning('Please wait, admin needs to approve this session.');
    }
  };

  const handleCopyCode = (code) => {
    if (!code) {
      toast.error('Invalid code to copy.');
      return;
    }
    
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedId(code);
        toast.success('Session code copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error('Clipboard error:', err);
        toast.error('Failed to copy code.');
      });
  };

  async function fetchSessionsData() {
    setLoading(true);
    
    try {
      const tutor_data = getSavedAuthData();
      setTutorCode(tutor_data?.user_code);
      
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(TutorEndPoints.TutorSessions, {
        baseURL: url,
        params: { tutor_code: tutor_data?.user_code }
      });
      
      if (response?.data?.results) {
        // Sort sessions by creation date or another relevant field
        const sortedSessions = response.data.results.sort((a, b) => {
          // Sort active sessions first, then by days remaining
          if (a.days_left > 0 && b.days_left <= 0) return -1;
          if (a.days_left <= 0 && b.days_left > 0) return 1;
          return b.days_left - a.days_left;
        });
        
        setAllSessions(sortedSessions);
      } else {
        setAllSessions([]);
      }
      
      setError(null);
    } catch (e) {
      console.error('Error fetching sessions:', e);
      setError('Failed to load sessions. Please try again.');
      toast.error('Error loading sessions. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  return {
    sessions,
    allSessions,
    loading,
    error,
    isModalOpen,
    tutorCode,
    activeTab,
    currentPage,
    totalPages,
    copiedId,
    openModal,
    closeModal,
    handleEnterSession,
    handleCopyCode,
    handleTabChange,
    handlePageChange,
    fetchSessionsData
  };
};