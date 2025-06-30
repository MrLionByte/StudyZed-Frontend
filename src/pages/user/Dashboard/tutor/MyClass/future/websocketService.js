// websocketService.js
class WebSocketService {
    constructor() {
      this.socket = null;
      this.messageHandlers = {};
    }
  
    connect(callType, callId, userId) {
      return new Promise((resolve, reject) => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/call/${callType}/${callId}/${userId}/`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const action = data.action;
            
            if (this.messageHandlers[action]) {
              this.messageHandlers[action](data);
            } else {
              // console.log('No handler for action:', action);
            }
          } catch (error) {
            // console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        this.socket.onclose = () => {
          // console.log('WebSocket connection closed');
        };
      });
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  
    send(data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      } else {
        console.error('WebSocket is not connected');
      }
    }
  
    on(action, callback) {
      this.messageHandlers[action] = callback;
    }
  
    sendOffer(receiverChannelName, offer, receiverId) {
      this.send({
        action: 'new-offer',
        message: {
          receiver_channel_name: receiverChannelName,
          receiver_id: receiverId,
          sdp: offer
        }
      });
    }
  
    sendAnswer(receiverChannelName, answer, receiverId) {
      this.send({
        action: 'new-answer',
        message: {
          receiver_channel_name: receiverChannelName,
          receiver_id: receiverId,
          sdp: answer
        }
      });
    }
  
    sendIceCandidate(receiverChannelName, candidate, receiverId) {
      this.send({
        action: 'new-ice-candidate',
        message: {
          receiver_channel_name: receiverChannelName,
          receiver_id: receiverId,
          candidate: candidate
        }
      });
    }
  
    joinCall() {
      this.send({
        action: 'join-call',
        message: {}
      });
    }
  
    leaveCall() {
      this.send({
        action: 'end-call',
        message: {}
      });
    }
  }
  
  export default WebSocketService;