import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Send,
  MoreVertical,
  ChevronLeft,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getStudentByCode } from '../../components/studentsInSession';

export default function Messaging() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tutor, setTutor] = useState();
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [loading, setLoading] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onlineStudents, setOnlineStudents] = useState([]);

  const lastMessageRef = useRef(null);

  const goBackToContacts = () => {
    setSidebarOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const studentDetails = getStudentByCode();

  useEffect(() => {
    if (!selectedUser) return;

    let retryCount = 0;
    const maxRetries = 3;
    const session_data = getSessionData();
    setTutor(session_data.sessions.tutor_code);
    const user_data = getSavedAuthData();
    setTutor(user_data);

    const connectWebSocket = () => {
      const ws = new WebSocket(
        `${import.meta.env.VITE_CHAT_URL}/ws/chat/${selectedUser.student_code}/?token=${user_data.accessToken}`,
      );

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        retryCount = 0;
        setOnlineStudents(prev => [...prev, selectedUser.id]);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (!data) {
          return;
        }

        if (data.type === 'chat_history' && Array.isArray(data.messages)) {
          setMessages(data.messages);
          return;
        }

        if (data.type === 'chat_message' && data.message) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.timestamp === data.timestamp);
            return exists ? prev : [...prev, data];
          });
          return;
        }
      };

      ws.onclose = (event) => {
        setConnected(false);    
        setOnlineStudents(prev => prev.filter(id => id !== selectedUser.id));
        if (event.code !== 1000 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = (error) => {
        setError('Failed to connect to chat server');
        setConnected(false);
        setOnlineStudents(prev => prev.filter(id => id !== selectedUser.id));
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
  }, [selectedUser]);

  async function fetchStudentsData() {
    setLoading(true);
    const session_data = getSessionData();
    try {
      const url = API_BASE_URLS['Session_Service'];
      const query_data = { session_code: session_data.sessions.session_code };
      const response = await api.get(TutorEndPoints.StudentsInSession, {
        baseURL: url,
        params: query_data,
      });

      setStudents(response.data);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fetchFromBackend) {
      fetchStudentsData();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || !input.trim() || !isStudentOnline(selectedUser?.id)) return;
    
    try {
      const messageData = {
        type: 'chat_message',
        message: input.trim(),
        sender: tutor.user_code,
        chat_id: selectedUser.student_code,
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

  const handleSelectedStudent = (student) => {
    setSelectedUser(student);
    setMessages([]);
    setSidebarOpen(false);
  };

  const isStudentOnline = (studentId) => {
    return onlineStudents.includes(studentId);
  };

  const filteredStudents = students.filter((student) =>
    student.student_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function getStudentNameByCode(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : 'Student not found';
  }

  function getStudentProfile(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent
      ? matchedStudent.profile?.profile_picture?.slice(13)
      : '';
  }

  const extractTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      const timePart = timestamp?.split('T')[1];
      return timePart ? timePart.slice(0, 5) : '';
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full bg-transparent p-2">
      <div className="flex h-[550px] md:h-[800px] w-full max-w-7xl mx-auto bg-transparent rounded-3xl shadow-md overflow-hidden">
  
        <div
          className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-col border-r bg-gray-800`}
        >
          <div className="p-4 bg-[#2f726d] text-white flex items-center justify-between">
            <h2 className="font-bold">Messages</h2>
          </div>
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-none text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-3 flex items-center space-x-3 cursor-pointer 
                hover:bg-gray-700 border-b border-gray-700 text-slate-200 ${
                  selectedUser?.id === student.id ? 'bg-[#2a6965]/40' : ''
                }`}
                onClick={() => {
                  handleSelectedStudent(student);
                }}
              >
                <div className="w-10 h-10 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#5682a3] font-bold relative">
                  {getStudentProfile(student.student_code) ? (
                    <img
                      className="rounded-full"
                      src={getStudentProfile(student.student_code)}
                      alt={student.student_code.charAt(0)}
                    />
                  ) : (
                    <p>{student.student_code.charAt(0)}</p>
                  )}
                  {isStudentOnline(student.id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {getStudentNameByCode(student.student_code)}
                    </h3>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-400 truncate">
                      {isStudentOnline(student.id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div
          className={`${!sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-gray-400/20`}
        >
          {selectedUser ? (
            <>
              <div className="flex items-center p-3 bg-[#2f726d] text-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#2a6965] md:hidden mr-1"
                  onClick={goBackToContacts}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="w-10 h-10 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#5682a3] font-bold relative">
                  <img
                    className="rounded-full"
                    src={getStudentProfile(selectedUser.student_code)}
                    alt={selectedUser.student_code.charAt(0)}
                  />
                  {isStudentOnline(selectedUser.id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#2f726d]"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h2 className="font-semibold">
                    {getStudentNameByCode(selectedUser.student_code)}
                  </h2>
                  <p className="text-xs opacity-80">
                    {isStudentOnline(selectedUser.id) ? 'online' : 'last seen recently'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#2a6965]"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2 text-black opacity-75">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === tutor.user_code ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === tutor.user_code
                            ? 'bg-[#effdde]'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex flex-col">
                          <p className="text-[15px] break-words">
                            {message.content || message.message}
                          </p>
                          <p className="flex justify-end text-[11px] text-gray-500 mt-1">
                            {extractTime(message.timestamp)}
                            {message.sender === tutor.user_code && (
                              <span className="ml-1 text-[#5fd467]">✓✓</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={lastMessageRef} className="h-0" />
                </div>
              </ScrollArea>

              <div className="p-3 bg-[#2a6965]">
                <div className="flex items-center space-x-2">
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
                    disabled={!isStudentOnline(selectedUser.id) || !input.trim()}
                    className="bg-[#5682a3] text-white hover:bg-[#4a729a] rounded-full h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="w-16 h-16 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#2f726d] mb-4">
                <Send className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">
                Select a student to start messaging
              </p>
              <p className="text-sm mt-1">
                Choose a student from your contacts list
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}