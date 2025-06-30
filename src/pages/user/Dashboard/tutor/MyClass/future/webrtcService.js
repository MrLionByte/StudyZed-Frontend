// webrtcService.js
class WebRTCService {
    constructor(iceServers) {
      this.connections = {};
      this.localStream = null;
      this.onRemoteStream = null;
      this.iceServers = iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ];
    }
  
    async initLocalStream(audio = true, video = true) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio,
          video,
        });
        return this.localStream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        throw error;
      }
    }
  
    stopLocalStream() {
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
    }
  
    createPeerConnection(userId) {
      if (this.connections[userId]) {
        return this.connections[userId];
      }
  
      const peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers,
      });
  
      
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, this.localStream);
        });
      }
  
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.onIceCandidate(userId, event.candidate);
        }
      };
  
      peerConnection.onconnectionstatechange = () => {
        // console.log(`Connection state for ${userId}: ${peerConnection.connectionState}`);
      };
  
      peerConnection.ontrack = (event) => {
        // console.log('Received remote track');
        if (this.onRemoteStream && event.streams && event.streams[0]) {
          this.onRemoteStream(userId, event.streams[0]);
        }
      };
  
      this.connections[userId] = peerConnection;
      return peerConnection;
    }
  
    async createOffer(userId) {
      const peerConnection = this.createPeerConnection(userId);
      
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        return offer;
      } catch (error) {
        console.error('Error creating offer:', error);
        throw error;
      }
    }
  
    async createAnswer(userId, offer) {
      const peerConnection = this.createPeerConnection(userId);
      
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        return answer;
      } catch (error) {
        console.error('Error creating answer:', error);
        throw error;
      }
    }
  
    async handleAnswer(userId, answer) {
      const peerConnection = this.connections[userId];
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error('Error handling answer:', error);
          throw error;
        }
      }
    }
  
    async addIceCandidate(userId, candidate) {
      const peerConnection = this.connections[userId];
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    }
  
    closeConnection(userId) {
      const peerConnection = this.connections[userId];
      if (peerConnection) {
        peerConnection.onicecandidate = null;
        peerConnection.ontrack = null;
        peerConnection.onconnectionstatechange = null;
        peerConnection.close();
        delete this.connections[userId];
      }
    }
  
    closeAllConnections() {
      Object.keys(this.connections).forEach(userId => {
        this.closeConnection(userId);
      });
    }
  
    setOnIceCandidate(callback) {
      this.onIceCandidate = callback;
    }
    
    toggleAudio(enabled) {
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach(track => {
          track.enabled = enabled;
        });
      }
    }
  
    toggleVideo(enabled) {
      if (this.localStream) {
        this.localStream.getVideoTracks().forEach(track => {
          track.enabled = enabled;
        });
      }
    }
  
    isAudioEnabled() {
      if (this.localStream && this.localStream.getAudioTracks().length > 0) {
        return this.localStream.getAudioTracks()[0].enabled;
      }
      return false;
    }
  
    isVideoEnabled() {
      if (this.localStream && this.localStream.getVideoTracks().length > 0) {
        return this.localStream.getVideoTracks()[0].enabled;
      }
      return false;
    }
  }
  
  export default WebRTCService;