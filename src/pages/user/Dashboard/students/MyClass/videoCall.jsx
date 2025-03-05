import React, { useEffect, useRef, useState } from 'react';
import { getSessionData } from '../../components/currentSession';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { X, Video, Mic, MicOff, VideoOff, Users, MessageSquare } from 'lucide-react';

const StudentGroupVideoCall = ({ onEndCall }) => {
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]); 
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('waiting');

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef({}); 

  const session_data = getSessionData();
  const sessionId = session_data.sessions?.session_code;
  const student_data = getSavedAuthData();
  const userId = student_data?.user?.id;
  const userCode = student_data?.user_code;
  const displayName = `Student-${student_data?.username}`;

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const initCall = async () => {
      try {
        const token = student_data?.accessToken;
        
        const socket = new WebSocket(`ws://localhost:8006/ws/video/${sessionId}/?token=${token}`);
        socketRef.current = socket;
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.onopen = () => {
          console.log('WebSocket connected');
          socket.send(
            JSON.stringify({
              type: 'join',
              user_id: userId,
              user_code: userCode,
              display_name: displayName,
              role: 'student',
            })
          );
          setConnectionStatus('connecting');
        };

        socket.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          switch (data.type) {
            case 'participants_list':
              handleParticipantsList(data.participants);
              break;
              
            case 'user_joined':
              handleUserJoined(data);
              break;
            
            case 'user_left':
              handleUserLeft(data.user_id);
              break;
              
            case 'offer':
              handleOffer(data);
              break;
              
            case 'answer':
              handleAnswer(data);
              break;
              
            case 'ice_candidate':
              handleIceCandidate(data);
              break;
              
            case 'chat_message':
              handleChatMessage(data);
              break;
          }
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          cleanupConnections();
          setConnectionStatus('ended');
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('ended');
        };
        
      } catch (error) {
        console.error('Error initializing call:', error);
        setConnectionStatus('ended');
      }
    };

    initCall();

    return () => {
      cleanupConnections();
    };
  }, [sessionId, userId, userCode, displayName]);
  
  const cleanupConnections = () => {
    if (socketRef.current) socketRef.current.close();
    
    Object.values(peerConnectionsRef.current).forEach(pc => {
      if (pc) pc.close();
    });
    peerConnectionsRef.current = {};
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleParticipantsList = (participantsList) => {
    setParticipants(participantsList);
    
    participantsList.forEach(participant => {
      if (participant.user_id !== userId) {
        createPeerConnection(participant.user_id, participant.display_name, true);
      }
    });
    
    if (participantsList.length > 0) {
      setConnectionStatus('active');
    }
  };
  
  const handleUserJoined = (data) => {
    setParticipants(prev => [
      ...prev.filter(p => p.user_id !== data.user_id),
      { 
        user_id: data.user_id, 
        user_code: data.user_code,
        display_name: data.display_name,
        role: data.role 
      }
    ]);
    
    if (data.user_id !== userId) {
      createPeerConnection(data.user_id, data.display_name, true);
    }
    
    setConnectionStatus('active');
  };
  
  const handleUserLeft = (departedUserId) => {
    setParticipants(prev => prev.filter(p => p.user_id !== departedUserId));
    
    if (peerConnectionsRef.current[departedUserId]) {
      peerConnectionsRef.current[departedUserId].close();
      const newPeerConnections = {...peerConnectionsRef.current};
      delete newPeerConnections[departedUserId];
      peerConnectionsRef.current = newPeerConnections;
    }
  };
  
  const createPeerConnection = async (peerId, peerName, initiator = false) => {
    try {
      if (peerConnectionsRef.current[peerId]) {
        console.log(`Peer connection to ${peerId} already exists`);
        return peerConnectionsRef.current[peerId];
      }
      
      console.log(`Creating peer connection to ${peerName} (${peerId})`);
      const pc = new RTCPeerConnection(iceServers);
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.send(JSON.stringify({
            type: 'ice_candidate',
            ice: event.candidate,
            sender_id: userId,
            recipient_id: peerId
          }));
        }
      };
      
      pc.onconnectionstatechange = () => {
        console.log(`Connection state to ${peerName}: ${pc.connectionState}`);
      };
      
      pc.ontrack = (event) => {
        console.log(`Received track from ${peerName}`);
        
        setParticipants(prev => prev.map(p => {
          if (p.user_id === peerId) {
            return {...p, stream: event.streams[0]};
          }
          return p;
        }));
      };
      
      peerConnectionsRef.current[peerId] = pc;
      
      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socketRef.current.send(JSON.stringify({
          type: 'offer',
          offer: pc.localDescription,
          sender_id: userId,
          sender_name: displayName,
          recipient_id: peerId
        }));
      }
      
      return pc;
    } catch (error) {
      console.error(`Error creating peer connection to ${peerName}:`, error);
    }
  };
  
  const handleOffer = async (data) => {
    try {
      const peerId = data.sender_id;
      const peerName = data.sender_name || 'Unknown';
      
      let pc = peerConnectionsRef.current[peerId];
      if (!pc) {
        pc = await createPeerConnection(peerId, peerName);
      }
      
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socketRef.current.send(JSON.stringify({
        type: 'answer',
        answer: pc.localDescription,
        sender_id: userId,
        sender_name: displayName,
        recipient_id: peerId
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };
  
  const handleAnswer = async (data) => {
    try {
      const pc = peerConnectionsRef.current[data.sender_id];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };
  
  const handleIceCandidate = (data) => {
    try {
      const pc = peerConnectionsRef.current[data.sender_id];
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(data.ice))
          .catch(e => console.error('Error adding ICE candidate:', e));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };
  
  const handleChatMessage = (data) => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: data.sender_id,
        senderName: data.sender_name || 'Unknown',
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: data.sender_id === userId,
      },
    ]);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: 'chat_message',
          message: newMessage,
          sender_id: userId,
          sender_name: displayName,
        })
      );

      setChatMessages(prev => [
        ...prev,
        {
          sender: userId,
          senderName: displayName,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
        },
      ]);

      setNewMessage('');
    }
  };

  const handleEndCall = () => {
    cleanupConnections();
    if (onEndCall) onEndCall();
  };

  const otherParticipants = participants.filter(p => p.user_id !== userId);

  return (
    <div className="fixed inset-0 bg-black z-50 max-h-screen">
      <div className="bg-gray-900 p-1 flex justify-between items-center">
        <div className="text-white font-medium flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Group Video Call ({participants.length} participant{participants.length !== 1 ? 's' : ''})
        </div>
        <div className="flex items-center">
          <span className={`text-sm mr-4 flex items-center ${
            connectionStatus === 'waiting' ? 'text-yellow-400' : 
            connectionStatus === 'connecting' ? 'text-blue-400' :
            connectionStatus === 'active' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <span className={`h-2 w-2 rounded-full mr-1 ${
              connectionStatus === 'waiting' ? 'bg-yellow-400' : 
              connectionStatus === 'connecting' ? 'bg-blue-400' :
              connectionStatus === 'active' ? 'bg-emerald-400' : 'bg-red-400'
            }`}></span>
            {connectionStatus === 'waiting' ? 'Waiting for others' : 
             connectionStatus === 'connecting' ? 'Connecting...' :
             connectionStatus === 'active' ? 'Connected' : 'Session Ended'}
          </span>
          <button
            className="text-white hover:text-gray-300 transition-all duration-300"
            onClick={handleEndCall}
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row p-1 gap-2">
        <div className="md:w-3/4 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg relative aspect-video">
              <video 
                ref={localVideoRef}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                You ({displayName})
              </div>
            </div>
            
            {otherParticipants.map((participant) => (
              <div key={participant.user_id} className="bg-gray-800 rounded-lg relative aspect-video">
                {participant.stream ? (
                  <video 
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    playsInline
                    srcObject={participant.stream}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    Connecting...
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {participant.display_name}
                </div>
              </div>
            ))}
            
            {otherParticipants.length === 0 && (
              <div className="bg-gray-800 rounded-lg flex items-center justify-center aspect-video">
                <div className="text-white text-center">
                  <p>Waiting for others to join...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/4 bg-gray-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </h3>
          <div className="flex-1 overflow-y-auto mb-4 bg-gray-700 rounded-lg p-3">
            <div className="space-y-3">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex items-start ${message.isMe ? 'justify-end' : ''}`}>
                  {!message.isMe && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 mr-2 flex items-center justify-center text-white text-xs">
                      {message.senderName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className={`rounded-lg p-2 text-white text-sm ${message.isMe ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {!message.isMe && <p className="text-xs text-gray-300 mb-1">{message.senderName}</p>}
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  {message.isMe && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 ml-2 flex items-center justify-center text-white text-xs">
                      {displayName.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white rounded-l-lg px-3 py-2 focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button 
              className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-all duration-300"
              onClick={sendChatMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 p-4 flex justify-center space-x-4">
        <button 
          className={`${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} text-white p-3 rounded-full transition-all duration-300`}
          onClick={toggleVideo}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button 
          className={`${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} text-white p-3 rounded-full transition-all duration-300`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>
    </div>
  );
};

export default StudentGroupVideoCall;