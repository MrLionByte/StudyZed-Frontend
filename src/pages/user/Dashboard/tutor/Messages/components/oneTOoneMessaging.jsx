import axios from 'axios';
import { useState, useEffect } from 'react';
import { getSavedAuthData } from '../../../../../../utils/Localstorage';
import api, { API_BASE_URLS } from '../../../../../../api/axios_api_call';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Send,
  User,
  LayoutDashboard,
  ClipboardList,
  ListTodo,
  Users,
  Activity,
  UserCircle,
} from 'lucide-react';
import { TutorEndPoints } from '../../../../../../api/endpoints/userEndPoints';

const ChatComponent = ({ chatId, currentUser, session_data }) => {
  const [socket, setSocket] = useState(null);

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [chattedUsers, setChattedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allStudentsMessages, setAllStudentsMessages] = useState([]);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser_ID, setSelectedUser_ID] = useState('');

  const messages = { a: 'b' };

  async function fetchStudentsData() {
    setLoading(true);
    try {
      console.log('session_code :', session_data);

      const url = API_BASE_URLS['Session_Service'];
      const qury_data = { session_code: session_data.sessions.session_code };
      console.log('QURY ', qury_data);

      const response = await api.get(TutorEndPoints.StudentsInSession, {
        baseURL: url,
        params: qury_data,
      });
      // setStudents(response.data);
      console.log('RESPONSE BRUT', response.data);
      const students = response.data;
      const studentCodes = students.map((student) => student.student_code);
      console.log('STUDENTS :', studentCodes);

      fetchStudentsDetails(studentCodes);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.error('Error :', e);
    }
  }

  useEffect(() => {
    if (fetchFromBackend) {
      fetchStudentsData();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  useEffect(() => {
    const fetchChattedUsers = async () => {
      try {
        const user_data = getSavedAuthData();
        const url = API_BASE_URLS['Message_Service'];

        const response = await api.get(
          `chatted-users/${user_data.user_code}/`,
          {
            baseURL: url,
          },
        );
        console.log('MSG RESPONSe :>', response);

        setChattedUsers(response.data.chatted_users);
      } catch (err) {
        console.error('Error fetching chatted users:', err);
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
      console.log('users', chattedUsers);
      if (chattedUsers != null) {
        chattedUsers;
      }
    };

    fetchChattedUsers();
  }, [currentUser]);

  useEffect(() => {
    const user_data = getSavedAuthData();
    let retryCount = 0;
    const maxRetries = 3;

    const connectWebSocket = () => {
      console.log('CONNECt :', selectedUser, selectedUser_ID);
      const chatId = selectedUser_ID || 1999;
      const ws = new WebSocket(
        `ws://localhost:8006/ws/chat/${sender_id}/?receiver_id=${user_data.user.id}`,
      );

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        setError(null);
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
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
  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || messageInput.trim() === '' || !connected) return;

    try {
      const messageData = {
        type: 'chat_message',
        message: messageInput,
        sender: currentUser,
        chat_id: chatId,
      };

      socket.send(JSON.stringify(messageData));
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const [selectedUser, setSelectedUser] = useState(null);

  const [newMessage, setNewMessage] = useState('');

  const handleSelectedUser = (user_code, user_id) => {
    if (user_code) {
      const selected = chattedUsers.find(
        (user) => user.user_code === user_code,
      );
      console.log('1111', user_code, selected);

      setSelectedUser_ID(user_id);
      setSelectedUser(selected);
    }
    // const user_messages =
  };

  console.log('JUSt :', selectedUser);

  const fetchStudentsDetails = async (studentCodes) => {
    try {
      const nextUrl = 'class-app/session-student-details/';
      const response = await api.post(nextUrl, { student_codes: studentCodes });
      console.log('ASD RES', response.data);
      setAllStudentsMessages(response?.data);
    } catch (e) {
      console.log('ERROR AT MSG 183:', e);
    }
  };

  const mockUsers = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Can you help me with React hooks?',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      unread: 2,
    },
    {
      id: 2,
      name: 'Emma Wilson',
      lastMessage: 'Thanks for the explanation!',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      unread: 0,
    },
    {
      id: 3,
      name: 'Michael Brown',
      lastMessage: 'I have a question about TypeScript',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      unread: 1,
    },
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        userId: 1,
        text: 'Hi, I need help with React hooks',
        isTutor: false,
        timestamp: '10:30 AM',
      },
      {
        id: 2,
        userId: 1,
        text: 'Specifically, useEffect is confusing',
        isTutor: false,
        timestamp: '10:31 AM',
      },
      {
        id: 3,
        userId: 1,
        text: "I'll explain how useEffect works with examples",
        isTutor: true,
        timestamp: '10:35 AM',
      },
    ],
    2: [
      {
        id: 1,
        userId: 2,
        text: 'Your explanation was very helpful',
        isTutor: false,
        timestamp: '9:20 AM',
      },
      {
        id: 2,
        userId: 2,
        text: 'Glad I could help! Let me know if you have more questions',
        isTutor: true,
        timestamp: '9:25 AM',
      },
    ],
  };

  return (
    <>
      <div className="flex-1 flex w-3/4">
        <div className="w-64 bg-[#111] border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold">OPEN CHAT</h2>
          </div>
          <div className="overflow-y-auto h-[calc(80vh-65px)]">
            {allStudentsMessages.map((user) => (
              <div
                key={user.user_code}
                onClick={() => handleSelectedUser(user.user_code, user.id)}
                className={`p-4 border-b border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedUser?.user_code === user.user_code
                    ? 'bg-gray-800'
                    : ''
                }`}
              >
                <img
                  src={
                    user.profile?.profile_picture
                      ? user.profile?.profile_picture?.replace(
                          'image/upload/',
                          '',
                        )
                      : 'https://img.icons8.com/?size=100&id=7819&format=png&color=41B31F'
                  }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{user.first_name}</h3>
                    {user.unread > 0 && (
                      <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        {user.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <h2 className="text-lg font-semibold">TUTOR AND ME</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Array.isArray(selectedUser.latest_message)
                  ? selectedUser.latest_message.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isTutor ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isTutor
                              ? 'bg-emerald-500 text-white rounded-br-none'
                              : 'bg-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isTutor
                                ? 'text-emerald-100'
                                : 'text-gray-400'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  : selectedUser.latest_message && (
                      <div
                        key={selectedUser.latest_message.id}
                        className={`flex ${selectedUser.latest_message.isTutor ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            selectedUser.latest_message.isTutor
                              ? 'bg-emerald-500 text-white rounded-br-none'
                              : 'bg-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{selectedUser.latest_message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              selectedUser.latest_message.isTutor
                                ? 'text-emerald-100'
                                : 'text-gray-400'
                            }`}
                          >
                            {selectedUser.latest_message.timestamp}
                          </p>
                        </div>
                      </div>
                    )}
              </div>

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-800"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
              <User className="w-16 h-16 mb-4" />
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
