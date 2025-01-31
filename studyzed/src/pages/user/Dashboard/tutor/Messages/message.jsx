import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getSavedAuthData } from "../../../../../utils/Localstorage";
import OneToOneChat from "./components/oneTOoneMessaging.jsx";
import {getSessionData} from '../../components/currentSession.js';

export default function Messaging({}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const session_data = getSessionData()
    console.log("LOCATIOn STATE :",session_data);
    
    useEffect(()=> {
        const user_data = getSavedAuthData();

    }, []);

    const sendMessage = () => {
        if (socket && input.trim()) {
            socket.send(input);
            setInput("");
        }
    };

    return (
        <div className="">
           
                    <OneToOneChat chatId="room1" session_data={session_data}
                        currentUser="user123"/>
             
        </div>
    );
}