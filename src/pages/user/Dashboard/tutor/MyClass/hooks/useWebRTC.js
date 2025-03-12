import { useState, useEffect, useRef, useCallback } from 'react';

const useWebRTC = (roomId, roomType, userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const localVideoRef = useRef(null);
  const iceServersRef = useRef([]);
  
  useEffect(() => {
    if (!roomId || !userId) return;
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/webrtc/${roomType}/${roomId}/`;
    
    socketRef.current = new WebSocket(wsUrl);
    
    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      socketRef.current.send(JSON.stringify({
        type: 'user_info',
        display_name: 'User ' + userId
      }));
    };
    
    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      cleanupConnections();
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please try again later.');
    };
    
    socketRef.current.onmessage = handleWebSocketMessage;
    
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      cleanupConnections();
    };
  }, [roomId, roomType, userId]);
  
  const handleWebSocketMessage = useCallback((event) => {
    const data = JSON.parse(event.data);
    console.log('Received message:', data);
    
    switch (data.type) {
      case 'ice_servers':
        iceServersRef.current = data.ice_servers;
        break;
        
      case 'user_joined':
        if (data.user_id !== userId) {
          console.log('New user joined:', data.user_id);
          setParticipants(prev => [...prev, {
            id: data.user_id,
            channel_name: data.channel_name
          }]);
          
          createPeerConnection(data.user_id, data.channel_name);
        }
        break;
        
      case 'user_left':
        if (data.user_id !== userId) {
          console.log('User left:', data.user_id);
          setParticipants(prev => prev.filter(p => p.id !== data.user_id));
          
          if (peerConnectionsRef.current[data.user_id]) {
            peerConnectionsRef.current[data.user_id].close();
            delete peerConnectionsRef.current[data.user_id];
          }
          
          setRemoteStreams(prev => {
            const newStreams = { ...prev };
            delete newStreams[data.user_id];
            return newStreams;
          });
        }
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
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [userId]);
  
  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      setLocalStream(stream);
      Object.keys(peerConnectionsRef.current).forEach(participantId => {
        createAndSendOffer(participantId);
      });
      
      return stream;
    } catch (err) {
      console.error('Error getting local stream:', err);
      setError('Could not access camera/microphone. Please check permissions.');
      return null;
    }
  }, []);
  
  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);
  
  const toggleCamera = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  }, [localStream, isCameraOff]);
  
  const leaveCall = useCallback(() => {
    cleanupConnections();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
  }, []);
  
  const cleanupConnections = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};
    setRemoteStreams({});
    setIsMuted(false);
    setIsCameraOff(false);
  }, [localStream]);
  
  return {
    isConnected,
    participants,
    localStream,
    remoteStreams,
    isMuted,
    isCameraOff,
    error,
    localVideoRef,
    leaveCall,
    toggleMicrophone,
    toggleCamera
  };
};

export default useWebRTC;
