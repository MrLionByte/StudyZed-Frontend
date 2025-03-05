import React, { useEffect, useState } from "react";
import VideoCall from "./videoCall";
import StudentVideoCall from "./studentOneOnOne";
import { getSavedAuthData } from "../../../../../utils/Localstorage";
import { getSessionData } from "../../components/currentSession";

const VideoChat = ({ userToken, studentId }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [socket, setSocket] = useState(null);
  const [inCall, setInCall] = useState(false);

  const user_data = getSavedAuthData();
  const session = getSessionData();
  const tutor_code = session?.sessions?.tutor_code
  const token = user_data?.accessToken

  const wsUrl = `ws://localhost:8006/ws/video-one-on-one/${tutor_code}/?token=${token}`;

  useEffect(() => {
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => console.log("WebSocket Connected");
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "offer") {
        setIncomingCall(true);
        setCurrentCall(data);
      }
    };

    newSocket.onclose = () => console.log("WebSocket Disconnected");
    
    setSocket(newSocket);

    return () => newSocket.close();
  }, [wsUrl]);

  const acceptCall = () => {
    setIncomingCall(false);
    setInCall(true);
  };

  return (
    <div className="p-4 text-white bg-gray-900 h-screen flex flex-col items-center">
      <h2 className="text-xl">Upcoming Session</h2>
      
      {incomingCall && (
        <button
          onClick={acceptCall}
          className="mt-4 p-2 bg-green-600 rounded-lg"
        >
          Accept Call
        </button>
      )}

      {inCall && (
        // <VideoCall 
        //   currentCall={tutor_code} 
        //   onEndCall={() => {
        //     setInCall(false);
        //     setCurrentCall(null);
        //   }} 
        //   userToken={token}
        // />
        <StudentVideoCall 
          currentCall={tutor_code} 
          onEndCall={() => {
            setInCall(false);
            setCurrentCall(null);
          }} 
          userToken={token}
        />
      )}
    </div>
  );
};

export default VideoChat;
