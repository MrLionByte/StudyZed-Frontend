import React, { useEffect, useRef, useState } from 'react';
import { X, Video, Mic, MicOff, VideoOff, Users, MessageSquare } from 'lucide-react';
import { getSessionData } from '../../../components/currentSession';
import { getSavedAuthData } from '../../../../../../utils/Localstorage';

const GroupVideoCall = ({ onEndCall }) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('waiting');
  
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const mainVideoRef = useRef(null);
  
  const session_data = getSessionData();
  const sessionId = session_data.sessions?.session_code;
  const tutor_data = getSavedAuthData();
  const userId = tutor_data?.user?.id;
  const userCode = tutor_data?.user_code;
  const displayName = `Tutor-${tutor_data?.username}`;

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };


  // Initialize WebSocket connection and media
  useEffect(() => {
    const initCall = async () => {
      try {
        const token = tutor_data?.accessToken
        // Connect to WebSocket
        const socket = new WebSocket(`ws://localhost:8006/ws/video/${sessionId}/?token=${token}`);
        socketRef.current = socket;
        
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Also set as main video initially
        if (mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
          setActiveSpeaker('local');
        }
        
        // Set up WebSocket event handlers
        socket.onopen = () => {
          console.log('WebSocket connected');
          // Send tutor info to identify role
          socket.send(JSON.stringify({
            type: 'join',
            user_id: userId,
            user_code: userCode,
            display_name: displayName,
            role: 'tutor'
          }));
        };
        
        socket.onmessage = (event) => {
          handleWebSocketMessage(JSON.parse(event.data));
        };
        
        socket.onclose = () => {
          console.log('WebSocket disconnected');
          // Clean up peer connections
          Object.values(peerConnections).forEach(pc => pc.close());
          setPeerConnections({});
        };
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };
    
    initCall();
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Close all peer connections
      Object.values(peerConnections).forEach(pc => pc.close());
    };
  }, [sessionId, userId, userCode, displayName]);
  
  // Handle WebSocket messages
  const handleWebSocketMessage = async (data) => {
    console.log('Received message:', data);
    
    switch (data.type) {
      case 'user_joined':
        console.log(`User joined: ${data.user_code} (${data.user_id})`);
        console.log('Current user ID:', userId);
    
        if (data.user_id !== userId) {
            console.log('Creating peer connection for', data.user_id);
            createPeerConnection(data.user_id);
        }
        break;    
        
      case 'user_left':
        // A user left the call
        console.log(`User left: ${data.user_id}`);
        if (peerConnections[data.user_id]) {
          peerConnections[data.user_id].close();
          const newPeerConnections = { ...peerConnections };
          delete newPeerConnections[data.user_id];
          setPeerConnections(newPeerConnections);
          
          // Remove remote stream
          const newRemoteStreams = { ...remoteStreams };
          delete newRemoteStreams[data.user_id];
          setRemoteStreams(newRemoteStreams);
          
          // Reset active speaker if needed
          if (activeSpeaker === data.user_id) {
            setActiveSpeaker('local');
            if (mainVideoRef.current) {
              mainVideoRef.current.srcObject = localStream;
            }
          }
        }
        break;
        
      case 'offer':
        // Received an offer from another user
        if (data.sender_id !== userId) {
          await handleOffer(data);
        }
        break;
        
      case 'answer':
        // Received an answer to our offer
        await handleAnswer(data);
        break;
        
      case 'ice_candidate':
        // Received an ICE candidate
        handleIceCandidate(data);
        break;
        
      case 'call_started':
        // Call has been started by the tutor
        console.log('Call started:', data.message);
        setSessionStatus('active');
        break;
        
      case 'call_ended':
        // Call has been ended by the tutor
        console.log('Call ended:', data.message);
        setSessionStatus('ended');
        if (onEndCall) {
          onEndCall();
        }
        break;
        
      case 'chat_message':
        // Received a chat message
        if (data.sender_id !== userId) {
          setChatMessages(prev => [...prev, {
            sender: data.sender_id,
            senderName: data.sender_name || 'Student',
            text: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }]);
        }
        break;
    }
  };
  
  // Create peer connection for a new user
  const createPeerConnection = async (remoteUserId) => {
    try {
      const pc = new RTCPeerConnection(iceServers);
      
      // Add local stream tracks to peer connection
      if (localStream) {
        localStream.getTracks().forEach(track => {
          console.log('Adding local track to peer connection:', track.kind);
          pc.addTrack(track, localStream);
        });
      }
      
      // Set up event handlers
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to student:', remoteUserId);
          socketRef.current.send(JSON.stringify({
            type: 'ice_candidate',
            ice: event.candidate,
            sender_id: userId,
            recipient_id: remoteUserId
          }));
        }
      };
      
      pc.onconnectionstatechange = (event) => {
        console.log('Connection state change:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          console.log('WebRTC connection established with student:', remoteUserId);
        }
      };
      
      pc.ontrack = (event) => {
        console.log('Received remote track from student:', event.track.kind);
        const stream = event.streams[0];
        setRemoteStreams(prev => ({
          ...prev,
          [remoteUserId]: stream
        }));
      };
      
      // Create and send offer
      console.log('Creating offer for student:', remoteUserId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      console.log('Sending offer to student:', remoteUserId);
      socketRef.current.send(JSON.stringify({
        type: 'offer',
        offer: pc.localDescription,
        sender_id: userId,
        recipient_id: remoteUserId
      }));
      
      // Add to peer connections
      setPeerConnections(prev => ({
        ...prev,
        [remoteUserId]: pc
      }));
      
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  };
  


  // Handle incoming offer
  const handleOffer = async (data) => {
    try {
      const pc = new RTCPeerConnection(iceServers);
      
      // Add local stream tracks to peer connection
      localStream?.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      
      // Set up event handlers
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.send(JSON.stringify({
            type: 'ice_candidate',
            ice: event.candidate,
            sender_id: userId,
            recipient_id: data.sender_id
          }));
        }
      };
      
      pc.ontrack = (event) => {
        console.log('Received remote track from:', event.track.kind);
        console.log('Remote user ID:', remoteUserId);
    
        const stream = event.streams[0];
        setRemoteStreams(prev => ({
            ...prev,
            [remoteUserId]: stream
        }));
    
        // Debugging: check if stream is correctly set
        console.log('Remote stream:', stream);
    };
    
      
      // Process the offer
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socketRef.current.send(JSON.stringify({
        type: 'answer',
        answer: pc.localDescription,
        sender_id: userId,
        recipient_id: data.sender_id
      }));
      
      // Add to peer connections
      setPeerConnections(prev => ({
        ...prev,
        [data.sender_id]: pc
      }));
      
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };
  
  // Handle incoming answer
  const handleAnswer = async (data) => {
    try {
      const pc = peerConnections[data.sender_id];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };
  
  // Handle incoming ICE candidate
  const handleIceCandidate = (data) => {
    try {
      const pc = peerConnections[data.sender_id];
      if (pc) {
        console.log('Adding ICE candidate from student:', data.sender_id);
        pc.addIceCandidate(new RTCIceCandidate(data.ice))
          .catch(e => console.error('Error adding ICE candidate:', e));
      } else {
        console.warn('Received ICE candidate but no peer connection exists for user:', data.sender_id);
      }
    } catch (error) {
      console.error('Error processing ICE candidate:', error);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  // Start the call (tutor only)
  const startCall = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'start_call'
      }));
      setSessionStatus('active');
    }
  };
  
  // End the call (tutor only)
  const endCall = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'end_call'
      }));
    }
    
    if (onEndCall) {
      onEndCall();
    }
  };
  
  // Send a chat message
  const sendChatMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'chat_message',
        message: newMessage,
        sender_id: userId,
        sender_name: displayName
      }));
      
      setChatMessages(prev => [...prev, {
        sender: userId,
        senderName: displayName,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }]);
      
      setNewMessage('');
    }
  };
  
  // Change the active speaker
  const changeActiveSpeaker = (id) => {
    setActiveSpeaker(id);
    if (mainVideoRef.current) {
      if (id === 'local') {
        mainVideoRef.current.srcObject = localStream;
      } else if (remoteStreams[id]) {
        mainVideoRef.current.srcObject = remoteStreams[id];
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 max-h-screen">
      {/* Header */}
      <div className="bg-gray-900 p-1 flex justify-between items-center">
        <div className="text-white font-medium flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Video Session (Tutor View)
        </div>
        <div className="flex items-center">
          <span className="text-emerald-400 text-sm mr-4 flex items-center">
            <span className="h-2 w-2 bg-emerald-400 rounded-full mr-1"></span>
            {sessionStatus === 'waiting' ? 'Waiting' : 
             sessionStatus === 'active' ? 'Live Session' : 'Session Ended'}
          </span>
          <button
            className="text-white hover:text-gray-300 transition-all duration-300"
            onClick={endCall}
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row p-1 gap-2">
        <div className="md:w-3/4 flex flex-col">
          {/* Main video */}
          <div className="bg-gray-800 rounded-lg flex items-center justify-center relative flex-1 mb-4">
            <video 
              ref={mainVideoRef}
              className="rounded-lg h-4/5"
              autoPlay
              playsInline
              muted={activeSpeaker === 'local'}
            />
            
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {activeSpeaker === 'local' ? 'You (Tutor)' : 'Student'}
            </div>
          </div>
          
          {/* Participant videos */}
          <div className="grid grid-cols-4 gap-2 h-24">
            {/* Local video */}
            <div 
              className={`bg-gray-700 rounded-lg overflow-hidden relative cursor-pointer ${activeSpeaker === 'local' ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => changeActiveSpeaker('local')}
            >
              <video 
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1 text-xs rounded">
                You (Tutor)
              </div>
            </div>
            
            {/* Remote videos */}
            {Object.entries(remoteStreams).map(([userId, stream]) => (
              <div 
                key={userId}
                className={`bg-gray-700 rounded-lg overflow-hidden relative cursor-pointer ${activeSpeaker === userId ? 'ring-2 ring-emerald-500' : ''}`}
                onClick={() => changeActiveSpeaker(userId)}
              >
                {/* <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  srcObject={stream}
                /> */}
                <video ref={(video) => { if (video) video.srcObject = stream; }} className="w-full h-full object-cover" autoPlay playsInline />

                <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1 text-xs rounded">
                  Student
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat panel */}
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
                    <div className="w-8 h-8 rounded-full bg-gray-500 mr-2 flex items-center justify-center text-white text-xs">
                      {message.senderName?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div className={`rounded-lg p-2 text-white text-sm ${message.isMe ? 'bg-emerald-600' : 'bg-gray-600'}`}>
                    {!message.isMe && <p className="text-xs text-gray-300 mb-1">{message.senderName}</p>}
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  {message.isMe && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 ml-2 flex items-center justify-center text-white text-xs">
                      T
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat input */}
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
              className="bg-emerald-600 text-white px-4 rounded-r-lg hover:bg-emerald-700 transition-all duration-300"
              onClick={sendChatMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      
      {/* Controls */}
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
        <button 
          className={`${sessionStatus === 'waiting' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-600'} text-white p-3 rounded-full transition-all duration-300`}
          onClick={sessionStatus === 'waiting' ? startCall : null}
          disabled={sessionStatus !== 'waiting'}
        >
          {sessionStatus === 'waiting' ? 'Start Session' : 'Session Active'}
        </button>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300" 
          onClick={endCall}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default GroupVideoCall;