import React, { useEffect, useState } from 'react';
import VideoCall from './videoCall';
import StudentVideoCall from './studentOneOnOne';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import { Video, Phone, X, Users, ChevronRight, Calendar } from 'lucide-react';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { toast, ToastContainer } from 'react-toastify';

const VideoChat = ({ userToken, studentId }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [socket, setSocket] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [inVideoCall, setInVideoCall] = useState(false);

  const user_data = getSavedAuthData();
  const session = getSessionData();
  const tutor_code = session?.sessions?.tutor_code;
  const token = user_data?.accessToken;

  const url = API_BASE_URLS['Message_Service'];

  const wsUrl = `ws://localhost:8006/ws/video-one-on-one/${tutor_code}/?token=${token}`;

  useEffect(() => {
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => console.log('WebSocket Connected');

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        setIncomingCall(true);
        setCurrentCall(data);
      }
    };

    newSocket.onclose = () => console.log('WebSocket Disconnected');

    setSocket(newSocket);

    return () => newSocket.close();
  }, [wsUrl]);

  const acceptCall = () => {
    setIncomingCall(false);
    setInCall(true);
  };

  const incomingCalls = [
    {
      id: '1',
      from: {
        id: 'tutor1',
        name: 'Dr. Sarah Wilson',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      },
      timestamp: new Date(),
      status: 'pending',
    },
  ];

  const [scheduledSessions, setScheduledSessions] = useState('');

  const handleLiveSession = () => {
    setInVideoCall(true);
  };

  const handleAcceptCall = () => {};

  const getLiveScheduledSession = async () => {
    try {
      const response = await api.get('meet/get-group-session/', {
        baseURL: url,
        params: { session_code: session?.sessions?.session_code },
      });
      setScheduledSessions(response.data);
      console.log('live :',response.data);
      
    } catch (err) {
      // toast.error('minor error occurred, try again later')
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getLiveScheduledSession();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return (
    <div className="flex gap-3 justify-center p-4 h-[630px] flex-1 items-center">
      <ToastContainer />
      {/* <div className="w-1/2 h-full flex items-center justify-center bg-gray-900 rounded-lg"> 
      <div className="col-span-6 bg-[#0F2942] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Video size={24} className="text-[#00FF9D]" />
                <span>One-on-One Sessions</span>
              </h2>
              
              {incomingCalls.length > 0 ? (
                <div className="space-y-4">
                  {incomingCalls.map(call => (
                    <div key={call.id} className="bg-[#1E3A5F] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={call.from.avatar}
                            alt={call.from.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{call.from.name}</h3>
                            <p className="text-sm text-gray-400">
                              Incoming call...
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3 p-3">
                          <button
                            onClick={() => handleAcceptCall(call)}
                            className="
                            bg-green-500 hover:bg-green-600 text-white 
                              p-3 rounded-full transition-colors"
                          >Accept call
                          </button>
                         
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1E3A5F] rounded-lg p-6 text-center">
                  <VideoOff size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No active calls</p>
                </div>
              )}
            </div>
      
      
      {incomingCall && (
        <button
          onClick={acceptCall}
          className="mt-4 p-2 bg-green-600 rounded-lg"
        >
          Accept Call
        </button>
      )}

      {inCall && (
        <StudentVideoCall 
          currentCall={tutor_code} 
          onEndCall={() => {
            setInCall(false);
            setCurrentCall(null);
          }} 
          userToken={token}
        />
      )}
      </div> */}
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
                    {/* <img
                            src={scheduledSessions.instructor.avatar}
                            alt={scheduledSessions.instructor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          /> */}
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
          }}
          userToken={token}
        />
      )}
    </div>
  );
};

export default VideoChat;
