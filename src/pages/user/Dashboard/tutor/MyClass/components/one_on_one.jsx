import React, { useEffect, useRef, useState } from 'react';

const OneToOneCall = ({ currentCall, onEndCall, userToken }) => {
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

  const receiverId = currentCall?.user_code;
  const wsUrl = `ws://localhost:8006/ws/video-one-on-one/${receiverId}/?token=${userToken}`;

  useEffect(() => {
    connectWebSocket();
    setupPeerConnection();

    return () => {
      socketRef.current?.close();
      peerConnectionRef.current?.close();
    };
  }, [wsUrl]);

  const connectWebSocket = () => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => console.log('WebSocket Connected');
    ws.onmessage = handleSignalingMessage;
    ws.onclose = () => {
      console.log('WebSocket Disconnected, reconnecting...');
      setTimeout(connectWebSocket, 2000); // Reconnect after 2 seconds
    };

    socketRef.current = ws;
  };

  const setupPeerConnection = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: 'ice_candidate', ice: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (error) {
      console.error('Error accessing camera/mic:', error);
    }

    peerConnectionRef.current = pc;
  };

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const initiateCall = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendMessage({ type: 'offer', offer });
    setIsCallStarted(true);
  };

  const handleSignalingMessage = async (event) => {
    const data = JSON.parse(event.data);
    const pc = peerConnectionRef.current;

    if (!pc) return;

    if (data.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendMessage({ type: 'answer', answer });
    } else if (data.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === 'ice_candidate' && data.ice) {
      await pc.addIceCandidate(new RTCIceCandidate(data.ice));
    } else if (data.type === 'call_ended') {
      endCall();
    }
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    sendMessage({ type: 'end_call' });
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 w-96 h-[630px] overflow-y-auto flex flex-col">
      <div className="bg-gray-900 p-1 flex justify-between items-center">
        <div className="text-white font-medium">
          Session with {currentCall?.student}
        </div>
        <button className="text-white" onClick={endCall}>
          End
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="md:w-3/4 bg-gray-800 rounded-lg flex items-center justify-center relative">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            playsInline
          />
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-4 flex justify-between space-x-4">
        {!isCallStarted && (
          <button
            onClick={initiateCall}
            className="bg-emerald-600 text-white p-3 rounded-full"
          >
            Start Session
          </button>
        )}
        <button
          className="bg-red-600 text-white p-3 rounded-full"
          onClick={endCall}
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default OneToOneCall;
