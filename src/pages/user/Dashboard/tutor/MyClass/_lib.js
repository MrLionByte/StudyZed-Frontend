import { useEffect, useState } from 'react';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import { toast } from 'react-toastify';

export const useSessionSelection = () => {
  const [sessionType, setSessionType] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [dueTime, setDueTime] = useState('13:00');
  const [selectedDay, setSelectedDay] = useState('today');
  const [loading, setLoading] = useState(false);
  const [groupSession, setGroupSession] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    started_at: '',
    time: '',
  });

  const url = API_BASE_URLS['Message_Service'];
  const session_data = getSessionData();

  const endCall = () => {
    setCallStatus('idle');
    setSelectedStudent(null);
  };

  const handleSessionSchedule = () => {
    setIsScheduling(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDaySelection = (day) => {
    setSelectedDay(day);
    setFormData({ ...formData, started_at: day });
  };

  const handleTimeChange = (e) => {
    let time = e.target.value;
    if (selectedDay === 'today') {
      const now = new Date();
      const selectedTime = new Date();

      const [hours, minutes] = time.split(':').map(Number);
      selectedTime.setHours(hours, minutes, 0);

      if (selectedTime <= now.setMinutes(now.getMinutes() + 5)) {
        now.setMinutes(now.getMinutes() + 5);
        time = now.toTimeString().slice(0, 5);
      }
    }
    setDueTime(time);
    setFormData({ ...formData, time: time });
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    const session_code = session_data?.sessions?.session_code;

    if (formData.started_at === 'today') {
      const now = new Date();
      const selectedTime = new Date();

      const [hours, minutes] = formData.time.split(':').map(Number);
      selectedTime.setHours(hours, minutes, 0);

      if (selectedTime <= now.setMinutes(now.getMinutes() + 2)) {
        now.setMinutes(now.getMinutes() + 5);
        formData.time = now.toTimeString().slice(0, 5);
      }
    }

    const payload = {
      session: session_code,
      description: formData.description,
      started_at: formData.started_at,
      time: formData.time,
      status: 'scheduled',
    };

    try {
      await api.post('meet/schedule-group-session/', payload, {
        baseURL: url,
      });

      toast.success(`Successfully scheduled session on ${formData.started_at}`);
      setFetchFromBackend(true);
    } catch (err) {
      toast.error("Failed to schedule session, refresh and try again");
    } finally {
      setIsScheduling(false);
    }
  };

  const getLiveScheduledSession = async () => {
    setLoading(true);
    try {
      const response = await api.get('meet/get-group-session/', {
        baseURL: url,
        params: { session_code: session_data?.sessions?.session_code },
      });
      setGroupSession(response.data);
    } catch (err) {
      toast.error("Failed to get data from backend, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleEndInBackend = async (groupSession, status) => {
    const payload = {
      id: groupSession.id,
      status: status,
    };
    try {
      await api.patch('meet/change-session-status/', payload, {
        baseURL: url,
      });
      setFetchFromBackend(true);
    } catch (err) {
      toast.error("Failed to end schedule, exit once again");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleEndCall = () => {
    handleEndInBackend(groupSession, 'ended');
    setSessionType(null);
    setFetchFromBackend(true)
  };

  const handleAttendCall = () => {
    // Placeholder for future functionality
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getLiveScheduledSession();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return {
    sessionType,
    setSessionType,
    callStatus,
    selectedStudent,
    endCall,
    handleSessionSchedule,
    formData,
    handleChange,
    handleDaySelection,
    handleTimeChange,
    dueTime,
    handleScheduleSession,
    isScheduling,
    loading,
    groupSession,
    handleAttendCall,
    handleEndCall,
  };
};
