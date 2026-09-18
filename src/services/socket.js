import { io } from 'socket.io-client';

// Replace with your hosted free signaling server URL (e.g., Render, Railway, or local IP for testing)
const SIGNALING_SERVER_URL = 'https://walkie-talkie-server-r0vx.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SIGNALING_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to signaling server:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });
  }

  // Join a specific walkie-talkie channel/room
  joinChannel(channelId) {
    if (this.socket) {
      this.socket.emit('join-channel', channelId);
    }
  }

  // Send WebRTC signaling data (offer, answer, ICE candidate) to peers in the room
  sendSignal(data) {
    if (this.socket) {
      this.socket.emit('signal', data);
    }
  }

  // Listen for incoming signals from other users
  onSignal(callback) {
    if (this.socket) {
      this.socket.on('signal', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();