import { useEffect, useState, useRef } from 'react';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../../api/endpoints/userEndPoints';

export const useStudentMessaging = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [student, setStudent] = useState();
  const [tutor, setTutor] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const lastMessageRef = useRef(null);

  const retryCountRef = useRef(0);
  const maxRetries = 5;

  const fetchStudentsData = async () => {
    const session_data = getSessionData();
    try {
      const query_data = { tutor_code: session_data?.sessions?.tutor_code };
      const response = await api.get(studentEndPoints.TutorSessionDetails, {
        params: query_data,
      });
      localStorage.setItem('tutor_id', JSON.stringify(response.data.data));
      setTutor(response.data);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      setLoading(true);
      setTimeout(() => {
        fetchStudentsData().then(() => setFetchFromBackend(false));
        setLoading(false);
      }, 2000);
    }
  }, [fetchFromBackend]);

  useEffect(() => {
    let retryCount = 0;
    if (!tutor) return;

    const user_data = getSavedAuthData();
    const session_data = getSessionData();
    setStudent(user_data);

    const connectWebSocket = () => {
      const tutorData = JSON.parse(localStorage.getItem('tutor_id'));
      const ws = new WebSocket(
        `${import.meta.env.VITE_CHAT_URL}/ws/chat/${tutor.data.tutor_code}/?token=${user_data.accessToken}`,
      );

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (!data) return;

        if (data.type === 'chat_history' && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else if (data.type === 'chat_message' && data.message) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.timestamp === data.timestamp);
            return exists ? prev : [...prev, data];
          });
        }
      };

      ws.onclose = (event) => {
        setConnected(false);
        if (event.code !== 1000 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = () => {
        setError('Failed to connect to chat server');
        setConnected(false);
      };

      setSocket(ws);
      return ws;
    };

    const ws = connectWebSocket();
    return () => ws?.close();
  }, [tutor]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || !input.trim() || !connected) return;

    try {
      const messageData = {
        type: 'chat_message',
        message: input.trim(),
        sender: student.user_code,
        chat_id: tutor.data.tutor_code,
      };
      socket.send(JSON.stringify(messageData));
      setInput('');
    } catch (error) {
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return {
    connected,
    error,
    messages,
    input,
    student,
    loading,
    lastMessageRef,
    setInput,
    sendMessage,
    handleKeyPress,
  };
};
