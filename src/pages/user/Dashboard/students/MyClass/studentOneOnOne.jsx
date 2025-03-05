import React, { useEffect, useRef, useState } from "react";

const StudentVideoCall = ({ currentCall, onEndCall, userToken }) => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const tutorId = currentCall
  const wsUrl = `ws://localhost:8006/ws/video-one-on-one/${tutorId}/?token=${userToken}`;

  useEffect(() => {
    const newSocket = new WebSocket(wsUrl);
    newSocket.onopen = () => console.log("WebSocket Connected");
    newSocket.onmessage = handleSignalingMessage;
    newSocket.onclose = () => console.log("WebSocket Disconnected");
    setSocket(newSocket);

    return () => newSocket.close();
  }, [wsUrl]);

  useEffect(() => {
    setupPeerConnection();
  }, []);

  const setupPeerConnection = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: "ice_candidate", ice: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing camera/mic:", error);
    }

    setPeerConnection(pc);
  };

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const handleSignalingMessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "offer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      sendMessage({ type: "answer", answer });

    } else if (data.type === "answer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));

    } else if (data.type === "ice_candidate") {
      if (data.ice) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
      }

    } else if (data.type === "call_ended") {
      endCall();
    }
  };

  const endCall = () => {
    peerConnection?.close();
    sendMessage({ type: "end_call" });
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div className="text-white font-medium">Video Call with Tutor</div>
        <button className="text-white" onClick={endCall}>End</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="md:w-3/4 bg-gray-800 rounded-lg flex items-center justify-center relative">
          <video ref={remoteVideoRef} className="w-full h-full object-cover rounded-lg" autoPlay playsInline />
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
            <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-4 flex justify-center space-x-4">
        <button className="bg-red-600 text-white p-3 rounded-full" onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default StudentVideoCall;
