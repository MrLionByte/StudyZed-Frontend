import { useEffect, useState } from 'react';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';

export const useVideoChatLogic = () => {
  const [currentCall, setCurrentCall] = useState(null);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduledSessions, setScheduledSessions] = useState('');

  const user_data = getSavedAuthData();
  const session = getSessionData();
  const token = user_data?.accessToken;
  const url = API_BASE_URLS['Message_Service'];

  const handleLiveSession = () => {
    setInVideoCall(true);
  };

  const getLiveScheduledSession = async () => {
    setLoading(true);
    try {
      const response = await api.get('meet/get-group-session/', {
        baseURL: url,
        params: { session_code: session?.sessions?.session_code },
      });
      setScheduledSessions(response.data);
    } catch (err) {
      // 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getLiveScheduledSession();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return {
    currentCall,
    setCurrentCall,
    inVideoCall,
    setInVideoCall,
    loading,
    scheduledSessions,
    handleLiveSession,
    token,
    setFetchFromBackend,
  };
};
