import React from 'react';
import VideoCall from './components/videoCall';
import { ToastContainer } from 'react-toastify';
import { Users, ChevronRight, Calendar } from 'lucide-react';
import LogoSvg from '../../../../../assets/test.svg';
import { useVideoChatLogic } from './_lib';

const VideoChat = () => {
  const {
    currentCall,
    setCurrentCall,
    inVideoCall,
    setInVideoCall,
    loading,
    scheduledSessions,
    handleLiveSession,
    token,
    setFetchFromBackend,
  } = useVideoChatLogic();

  // const wsUrl = `ws://localhost:8006/ws/video-one-on-one/${tutor_code}/?token=${token}`;
  // useEffect(() => {
  //   const newSocket = new WebSocket(wsUrl);

  //   newSocket.onopen = () => console.log('WebSocket Connected');

  //   newSocket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'offer') {
  //       setIncomingCall(true);
  //       setCurrentCall(data);
  //     }
  //   };
  //   newSocket.onclose = () => console.log('WebSocket Disconnected');

  //   setSocket(newSocket);

  //   return () => newSocket.close();
  // }, [wsUrl]);

  // const acceptCall = () => {
  //   setIncomingCall(false);
  //   setInCall(true);
  // };

  // const incomingCalls = [
  //   {
  //     id: '1',
  //     from: {
  //       id: 'tutor1',
  //       name: 'Dr. Sarah Wilson',
  //       avatar:
  //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  //     },
  //     timestamp: new Date(),
  //     status: 'pending',
  //   },
  // ];

  return (
    <div className="flex gap-3 justify-center p-4 h-[630px] flex-1 items-center">
      <ToastContainer />
   
      <div className="w-1/2 h-full flex items-center justify-center student-card rounded-lg">
        <div className="col-span-6 bg-[#0F2942] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Users size={24} className="text-[#00FF9D]" />
            <span>Group Sessions</span>
          </h2>

          {scheduledSessions ? (
            <div className="space-y-4">
              <div className="bg-[#1E3A5F] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">Live Session</h3>
                      <p className="text-sm text-gray-400">with Tutor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00FF9D] font-medium">
                      {scheduledSessions.started_at.slice(0, 10)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {scheduledSessions.started_at.slice(11, 16)} mins
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center ">
                  {scheduledSessions.status === 'live' ? 
                  <button
                    onClick={handleLiveSession}
                    className="bg-[#00FF9D] text-[#0A1929] px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#00CC7D] transition-colors"
                  >
                    <span>Join Session</span>
                    <ChevronRight size={16} />
                  </button>
                  
                  : 
                  <div
                  className="flex flex-col items-center justify-center p-3 
    border-2 border-red-500 rounded-lg 
    transition-all duration-300 w-full"
                >
                  Session {scheduledSessions.status}
                </div>
                  
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E3A5F] rounded-lg p-6 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">No scheduled sessions</p>
            </div>
          )}
        </div>
      </div>
      {inVideoCall && (
        <VideoCall
          onEndCall={() => {
            setInVideoCall(false);
            setCurrentCall(null);
            setFetchFromBackend(true);
          }}
          userToken={token}
        />
      )}
      
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
    </div>
  );
};

export default VideoChat;
