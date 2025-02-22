// import { useEffect, useState } from "react";
// import { MessageCircle, Send, Search, CircleUserRound } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { getSessionData } from "../../components/currentSession";
// import api,{API_BASE_URLS} from "../../../../../api/axios_api_call";
// import {TutorEndPoints} from "../../../../../api/endpoints/userEndPoints";

// export default function Messaging() {
//     // Mock students data
//     // const students = [
//     //     { id: "user456", name: "Alice Smith", lastMessage: "See you tomorrow!", unread: 2 },
//     //     { id: "user789", name: "Bob Johnson", lastMessage: "Thanks for the help!", unread: 0 },
//     //     { id: "user101", name: "Carol White", lastMessage: "Got it!", unread: 1 },
//     //     { id: "user102", name: "David Brown", lastMessage: "When is the next class?", unread: 0 },
//     //     { id: "user103", name: "Eva Green", lastMessage: "Project submitted!", unread: 0 },
//     //     { id: "user103", name: "Eva Green", lastMessage: "Project submitted!", unread: 0 },
//     //     { id: "user103", name: "Eva Green", lastMessage: "Project submitted!", unread: 0 }
//     // ];

//     // Mock messages for each student
//     const mockMessages = {
//         user456: [
//             { id: 1, content: "Hi there!", sender: "user456", timestamp: "2024-02-08T10:00:00Z" },
//             { id: 2, content: "How's your study going?", sender: "user123", timestamp: "2024-02-08T10:01:00Z" },
//             { id: 3, content: "Pretty good! Working on the assignment", sender: "user456", timestamp: "2024-02-08T10:02:00Z" },
//             { id: 4, content: "See you tomorrow!", sender: "user456", timestamp: "2024-02-08T10:03:00Z" }
//         ],
//         user789: [
//             { id: 1, content: "Hey, need help with the math problem", sender: "user789", timestamp: "2024-02-08T11:00:00Z" },
//             { id: 2, content: "Which one?", sender: "user123", timestamp: "2024-02-08T11:01:00Z" },
//             { id: 3, content: "Question 5 from homework", sender: "user789", timestamp: "2024-02-08T11:02:00Z" },
//             { id: 4, content: "Thanks for the help!", sender: "user789", timestamp: "2024-02-08T11:03:00Z" }
//         ]
//     };

//     // const [students, setStudents] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [students, setStudents] = useState([]);

//     const [input, setInput] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const currentUser = "user123";
//     const [fetchFromBackend, setFetchFromBackend] = useState(true)
//     const [loading, setLoading] = useState('')
//     const [error, setError] = useState('')

//     useEffect(() => {
//         if (selectedUser) {
//             setMessages(mockMessages[selectedUser.id] || []);
//         }
//     }, [selectedUser]);

//     async function fetchStudentsData () {
//         setLoading(true);
//         const session_data = getSessionData()
//         try {
//             console.log("session_code :",session_data);

//             const url = API_BASE_URLS["Session_Service"]
//             const qury_data = {"session_code": session_data.sessions.session_code}
//             console.log("QURY ",qury_data);

//             const response = await api.get(TutorEndPoints.StudentsInSession,{
//                 baseURL: url,
//                 params: qury_data,
//             });
//             // setStudents(response.data);
//             console.log("RESPONSE BRUT",response.data)
//             const students = response.data
//             const studentCodes = students.map(student => student.student_code);
//             console.log("STUDENTS :", studentCodes);

//             setStudents(response.data)

//         } catch (e) {
//             setError(e);
//             setLoading(false);
//             console.log("Error :", e);
//         }
//       };

//       useEffect(() => {
//         if (fetchFromBackend) {
//           fetchStudentsData();
//           setFetchFromBackend(false);
//         }
//       }, [fetchFromBackend]);

//     // const filteredStudents = students.filter(student =>
//     //     student.name.toLowerCase().includes(searchTerm.toLowerCase())
//     // );

//     const sendMessage = () => {
//         if (input.trim() && selectedUser) {
//             const newMessage = {
//                 id: messages.length + 1,
//                 content: input.trim(),
//                 sender: currentUser,
//                 timestamp: new Date().toISOString()
//             };
//             setMessages([...messages, newMessage]);
//             setInput("");
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     return (
//     <div className="flex justify-center items-center h-full w-full">
//         <div className="flex h-[500px] w-full max-w-5xl mx-auto bg-slate-400 p-2 rounded-lg">
//             {/* Sidebar */}
//             <Card className="w-80 border-r flex flex-col">
//                 <div className="p-4 border-b">
//                     <Input
//                         placeholder="Search students..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full"
//                         prefix={<Search className="h-4 w-4 text-gray-500" />}
//                     />
//                 </div>
//                 <ScrollArea className="flex-1">
//                     {students.map((student) => (
//                         <div
//                             key={student.id}
//                             className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 ${
//                                 selectedUser?.id === student.id ? 'bg-gray-100' : ''
//                             }`}
//                             onClick={() => setSelectedUser(student)}
//                         >
//                             <img src="data:image/png;base64,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" alt="circled-user-male-skin-type-5"></img>

//                             <div className="flex-1">
//                                 <h3 className="font-medium">{student.student_code}</h3>
//                                 <p className="text-sm text-gray-500 truncate">{student.lastMessage}</p>
//                             </div>
//                             {student.unread > 0 && (
//                                 <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                                     {student.unread}
//                                 </span>
//                             )}
//                         </div>
//                     ))}
//                 </ScrollArea>
//             </Card>

//             {/* Chat Area */}
//             {selectedUser ? (
//                 <Card className="flex-1 flex flex-col">
//                     <div className="flex items-center p-4 border-b">
//                         <div className="flex items-center space-x-4">
//                             <img src="data:image/png;base64,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" alt="circled-user-male-skin-type-5"></img>

//                             <div>
//                                 <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
//                                 <p className="text-sm text-gray-500">Online</p>
//                             </div>
//                         </div>
//                     </div>

//                     <ScrollArea className="flex-1 p-4">
//                         <div className="space-y-4">
//                             {messages.map((message) => (
//                                 <div
//                                     key={message.id}
//                                     className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
//                                 >
//                                     <div
//                                         className={`max-w-[80%] rounded-lg p-3 ${
//                                             message.sender === currentUser
//                                                 ? 'bg-blue-500 text-white'
//                                                 : 'bg-gray-100'
//                                         }`}
//                                     >
//                                         <p>{message.content}</p>
//                                         <span className="text-xs opacity-50 mt-1 block">
//                                             {new Date(message.timestamp).toLocaleTimeString()}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </ScrollArea>

//                     <div className="p-4 border-t">
//                         <div className="flex space-x-2">
//                             <Input
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 placeholder="Type a message..."
//                                 className="flex-1"
//                             />
//                             <Button onClick={sendMessage} size="icon">
//                                 <Send className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     </div>
//                 </Card>
//             ) : (
//                 <div className="flex-1 flex items-center justify-center text-gray-500">
//                     Select a student to start chatting
//                 </div>
//             )}
//         </div>
//     </div>
//     );
// }

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Search, CircleUserRound } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSavedAuthData } from '../../../../../utils/Localstorage';

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

  const lastMessageRef = useRef(null);
  console.log('MSG :', messages);

  useEffect(() => {
    if (!selectedUser) return;

    let retryCount = 0;
    const maxRetries = 3;
    const session_data = getSessionData();
    setTutor(session_data.sessions.tutor_code);
    console.log('TUTOR', session_data.sessions.tutor_code);
    const user_data = getSavedAuthData();
    setTutor(user_data);
    console.log('TUTOR 22', user_data);

    const connectWebSocket = () => {
      const ws = new WebSocket(
        `ws://localhost:8006/ws/chat/${selectedUser.student_code}/?token=${user_data.accessToken}`,
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
          setMessages((prev) => [...prev, data]);
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
      console.log('RES :', response);

      setStudents(response.data);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.error('Error:', e);
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
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket || !input.trim() || !connected) return;
    console.log('test', selectedUser);

    try {
      const messageData = {
        type: 'chat_message',
        message: input.trim(),
        sender: tutor.user_code,
        chat_id: selectedUser.student_code,
      };

      socket.send(JSON.stringify(messageData));
      console.log('MEssage Send', messageData);
      setMessages((prev) => [...prev, messageData]);
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

  const filteredStudents = students.filter((student) =>
    student.student_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex h-[500px] w-full max-w-5xl mx-auto bg-slate-400 p-2 rounded-lg">
        <Card className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-gray-500" />}
            />
          </div>
          <ScrollArea className="flex-1">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === student.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedUser(student)}
              >
                <img
                  src="https://img.icons8.com/?size=40&id=77883&format=png&color=000000"
                  alt="User avatar"
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{student.student_code}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {connected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>

        {selectedUser ? (
          <Card className="flex-1 flex flex-col">
            <div className="flex items-center p-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src="https://img.icons8.com/?size=40&id=77883&format=png&color=000000"
                  alt="User avatar"
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedUser.student_code}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {connected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                   
                    className={`flex ${message.sender === tutor.user_code ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === tutor.user_code
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className='flex flex-col'>
                      <p>{message.message || message.content}</p>
                      <p className="flex justify-between text-tiny opacity-40 space-x-3">
                      <span>{message.time}</span>  <span>{message.date}</span> 
                      </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={lastMessageRef} className="h-0" />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon" disabled={!connected}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Card>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a student to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
