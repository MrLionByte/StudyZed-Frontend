// import { useEffect, useState } from "react";
// import { MessageCircle, Send, Search, CircleUserRound } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { getSessionData } from "../../components/currentSession";
// import api,{api_dictatory} from "../../../../../api/axios_api_call";
// import {studentEndPoints} from "../../../../../api/endpoints/userEndPoints";


// export default function Messaging() {
//     const selectedUser = {
//         name: "John Doe",
//       };
      
//       const currentUser = "user1";
      
//       const temp_messages = [
//         {
//           id: 1,
//           sender: "user1",
//           content: "Hey! How's it going?",
//           timestamp: new Date().toISOString(),
//         },
//         {
//           id: 2,
//           sender: "user2",
//           content: "I'm good! Just working on some projects. You?",
//           timestamp: new Date().toISOString(),
//         },
//         {
//           id: 3,
//           sender: "user1",
//           content: "Same here. Just wrapping up a few tasks.",
//           timestamp: new Date().toISOString(),
//         },
//         {
//             id: 4,
//             sender: "user2",
//             content: "Same here. Just wrapping up a few tasks. asdasdasdasdasdsadsadasdasdasdasdasdasdasdasdsaddasdddddddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//             timestamp: new Date().toISOString(),
//           },
//       ];

//     // const [students, setStudents] = useState(null);
//     // const [selectedUser, setSelectedUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [students, setStudents] = useState([]);
    
//     const [tutor, setTutor] = useState([])
//     const [input, setInput] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
    
//     const [fetchFromBackend, setFetchFromBackend] = useState(true)
//     const [loading, setLoading] = useState('')
//     const [error, setError] = useState('')

//     useEffect(() => {
//         setMessages(temp_messages)
        
//     }, []);

//     async function fetchStudentsData () {
//         setLoading(true);
//         const session_data = getSessionData()
//         try {
//             console.log("session_code :",session_data);
            
//             const query_data = {"tutor_code": session_data.sessions.tutor_code}
//             console.log("QURY ",query_data);
            
//             const response = await api.get(studentEndPoints.TutorSessionDetails,{
//                 params: query_data,
//             });
//             // setStudents(response.data);
//             console.log("RESPONSE BRUT",response.data)
            
//             setTutor(response.data)
    
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
//         <div className="flex h-[500px] w-[700px] max-w-5xl mx-auto bg-slate-400 p-2 rounded-lg">
//             {/* Sidebar */}
//             {/* <Card className="w-80 border-r flex flex-col">
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
//             </Card> */}

//             {/* Chat Area */}
            
//             {selectedUser ? (
//                 <Card className="flex-1 flex flex-col">
//                     <div className="flex items-center p-4 border-b">
//                         <div className="flex items-center space-x-4">
                            
//                             <img src="data:image/png;base64,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" alt="circled-user-male-skin-type-5"></img>
                            
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-400">TUTOR : <span className="text-medium text-black">{selectedUser.name}</span></h2>
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
//                                         className={`max-w-[80%] rounded-lg p-3 break-all ${
//                                             message.sender === currentUser
//                                                 ? 'bg-blue-500 text-white'
//                                                 : 'bg-gray-100'
//                                         }`}
//                                     >
//                                         <p className="break-all">{message.content}</p>
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

import { useEffect, useState } from "react";
import { MessageCircle, Send, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getSavedAuthData } from "../../../../../utils/Localstorage";
import { getSessionData } from "../../components/currentSession";
import api,{api_dictatory} from "../../../../../api/axios_api_call";
import {studentEndPoints} from "../../../../../api/endpoints/userEndPoints";

export default function StudentMessaging() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [student, setStudent] = useState();
    const [tutor, setTutor] = useState('')
    const [loading, setLoading] = useState(false);
    const [fetchFromBackend, setFetchFromBackend] = useState(true)
    
    async function fetchStudentsData () {
    setLoading(true);
    const session_data = getSessionData()
    try {
        console.log("session_code :",session_data);
        
        const query_data = {"tutor_code": session_data?.sessions?.tutor_code}
        console.log("QUERY :",query_data);
        
        const response = await api.get(studentEndPoints.TutorSessionDetails,{
            params: query_data,
        });
        // setStudents(response.data);
        console.log("RESPONSE BRUT",response.data)
        localStorage.setItem("tutor_id", JSON.stringify(response.data.data));

        setTutor(response.data)

    } catch (e) {
        setError(e);
        setLoading(false);
        console.log("Error :", e);
    }
    };

    useEffect(() => {
        if (fetchFromBackend) {
            fetchStudentsData().then(() => setFetchFromBackend(false));
            // setFetchFromBackend(false);
        }
    }, [fetchFromBackend]);

    useEffect(() => {
        if (!tutor ) return
        let retryCount = 0;
        const maxRetries = 3;
        const user_data = getSavedAuthData();
        const session_data = getSessionData();
        setStudent(user_data);
        

        const connectWebSocket = () => {
            console.log("TUTOR ON CHAT :",tutor);
            console.log("TUTOR ON CHAT :",session_data);
            const tutorData = JSON.parse(localStorage.getItem("tutor_id"));
            console.log(tutor.data.tutor_code);
            const ws = new WebSocket(`ws://localhost:8006/ws/chat/${tutor.data.tutor_code}/?token=${user_data.accessToken}`);

            ws.onopen = () => {
                console.log('Connected to WebSocket');
                setConnected(true);
                setError(null);
                retryCount = 0;
            };

            ws.onmessage = (event) => {
                console.log("Received WebSocket message:", event.data);

                const data = JSON.parse(event.data);
                
                if (!data) {
                    console.log("Invalid message received:", data);
                    return;
                }
                if (data.type === "chat_history" && Array.isArray(data.messages)) {
                    console.log("Received chat history:", data.messages);
                    setMessages(data.messages);  
                    return;
                }
            

                if ( data.type === "chat_message" && data.message) {
                    console.log("Received chat message:", data);
                    
                    if (!messages.includes(data)) {
                        setMessages((prev) => [...prev, data]); 
                    } 
                    return;
                }

                if (data && data.message && data.sender) {
                    console.log("Received chat message sender:", data, data.timestamp);
                    const exists = messages.some((message) => message.timestamp === data.timestamp);
                    console.log(exists);
                    
                    if (exists){
                        return
                    } else{
                        setMessages((prev) => [...prev, data]); 
                    }
                    
                    return;
                }

                console.log("Unhandled message type:", data);
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setConnected(false);
                
                if (event.code !== 1000 && retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Attempting to reconnect... (${retryCount}/${maxRetries})`);
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
            console.log("FIX SEND :",student, tutor);
            const messageData = {
                type: 'chat_message',
                message: input.trim(),
                sender: student.user_code,
                chat_id: tutor.data.tutor_code
            };
            
            // setMessages((prev) => [...prev, messageData]); 

            socket.send(JSON.stringify(messageData));
            console.log("FIX SEND :",messageData);
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

    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="flex h-[500px] w-[700px] max-w-5xl mx-auto bg-slate-400 p-2 rounded-lg">
                <Card className="flex-1 flex flex-col">
                    <div className="flex items-center p-4 border-b">
                        <div className="flex items-center space-x-4">
                            <img 
                                src="https://img.icons8.com/?size=40&id=77883&format=png&color=000000"
                                alt="User avatar"
                                className="rounded-full"
                            />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-400">
                                    TUTOR
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
                                    className={`flex ${message.sender === student?.user_code ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 break-all ${
                                            message.sender === student?.user_code
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <p className="break-all">{message.message || message.content}</p>
                                        <span className="text-xs opacity-50 mt-1 block">
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
                            <Button 
                                onClick={sendMessage} 
                                size="icon"
                                disabled={!connected}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
