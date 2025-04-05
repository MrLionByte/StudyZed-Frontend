import { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Phone, VideoIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../../api/endpoints/userEndPoints';
import ChatSkeleton from '../../components/chatSkelton';

export default function StudentMessaging() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [student, setStudent] = useState();
  const [tutor, setTutor] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const maxDelay = 16000;

  const lastMessageRef = useRef(null);

  async function fetchStudentsData() {
    const session_data = getSessionData();
    try {
      console.log('session_code :', session_data);

      const query_data = { tutor_code: session_data?.sessions?.tutor_code };
      console.log('QUERY :', query_data);

      const response = await api.get(studentEndPoints.TutorSessionDetails, {
        params: query_data,
      });
      // setStudents(response.data);
      console.log('RESPONSE BRUT', response.data);
      localStorage.setItem('tutor_id', JSON.stringify(response.data.data));

      setTutor(response.data);
    } catch (e) {
      setError(e);
      console.log('Error :', e);
    }
  }

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
      console.log('TUTOR ON CHAT :', tutor);
      console.log('TUTOR ON CHAT :', session_data);
      const tutorData = JSON.parse(localStorage.getItem('tutor_id'));
      console.log(tutor.data.tutor_code);
      const ws = new WebSocket(
        `${import.meta.env.VITE_CHAT_URL}/ws/chat/${tutor.data.tutor_code}/?token=${user_data.accessToken}`,
      );

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        setError(null);
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);

        const data = JSON.parse(event.data);

        if (!data) {
          console.log('Invalid message received:', data);
          return;
        }
        if (data.type === 'chat_history' && Array.isArray(data.messages)) {
          console.log('Received chat history:', data.messages);
          setMessages(data.messages);
          return;
        }

        if (data.type === 'chat_message' && data.message) {
          console.log('Received chat message:', data);
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.timestamp === data.timestamp);
            return exists ? prev : [...prev, data];
          });
          return;
        }

        console.log('Unhandled message type:', data);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnected(false);

        if (event.code !== 1000 && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Attempting to reconnect... (${retryCount}/${maxRetries})`,
          );
          setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to chat server');
        setConnected(false);
      };

      setSocket(ws);
      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [tutor]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || !input.trim() || !connected) return;

    try {
      console.log('FIX SEND :', student, tutor);
      const messageData = {
        type: 'chat_message',
        message: input.trim(),
        sender: student.user_code,
        chat_id: tutor.data.tutor_code,
      };

      // setMessages((prev) => [...prev, messageData]);

      socket.send(JSON.stringify(messageData));
      console.log('FIX SEND :', messageData);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <div className="flex w-full justify-center mt-5 items-center bg-transparent ">
      <div className="flex flex-col h-[550px] md:h-[800px] w-full max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <div className="flex items-center p-3 bg-[#2f726d] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#5682a3] font-bold">
              T
            </div>
            <div>
              <h2 className="font-semibold">TUTOR</h2>
              <p className="text-xs opacity-80">
                {connected ? 'online' : 'last seen recently'}
              </p>
            </div>
          </div>

          <div className="ml-auto flex space-x-1">
            {/* <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <VideoIcon className="h-4 w-4" />
          </Button> */}
            {/* <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <MoreVertical className="h-4 w-4" />
          </Button> */}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-gray-400/20 text-[#AEBAC1]">
          <div className="space-y-2 text-black opacity-75 ">
            {loading ? (
              <ChatSkeleton />
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === student.user_code ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === student.user_code
                          ? 'bg-[#effdde]'
                          : 'bg-white'
                      }`}
                    >
                      <p className="break-word text-[15px]">
                        {message.content || message.message}
                      </p>
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-[11px] text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {message.sender === student.user_code && (
                          <span className="ml-1 text-[#5fd467]">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div ref={lastMessageRef} className="h-0" />
          </div>
        </ScrollArea>

        <div className="p-3 bg-[#2a6965] border-t">
          <div className="flex items-center space-x-2">
            {/* <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button> */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message"
              className="rounded-full flex-1 border-none text-black bg-white"
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!connected || !input.trim()}
              className="bg-[#5682a3] text-white hover:bg-[#4a729a] rounded-full h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">*</p>}
        </div>
      </div>
    </div>
  );
}
