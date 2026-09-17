import { RTCPeerConnection, mediaDevices, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import SocketService from './socket';

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.onRemoteStream = null;
  }

  // Initialize WebRTC connection and handle signaling events
  init(onStreamCallback) {
    this.onRemoteStream = onStreamCallback;

    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Handle incoming remote audio stream from peer
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        console.log('Received remote audio stream');
        if (this.onRemoteStream) {
          this.onRemoteStream(event.streams[0]);
        }
      }
    };

    // Handle ICE candidates and send them via socket signaling
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SocketService.sendSignal({ type: 'candidate', candidate: event.candidate });
      }
    };

    // Listen for incoming signals from signaling server
    SocketService.onSignal(async (data) => {
      try {
        if (data.type === 'offer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          SocketService.sendSignal({ type: 'answer', answer });
        } else if (data.type === 'answer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === 'candidate') {
          if (this.peerConnection) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        }
      } catch (error) {
        console.error('Error handling WebRTC signal:', error);
      }
    });
  }

  // Start recording audio and sending it when PTT button is pressed
  async startTransmitting() {
    try {
      this.localStream = await mediaDevices.getUserMedia({ audio: true, video: false });
      
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Create and send offer if initiating connection
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      SocketService.sendSignal({ type: 'offer', offer });

      console.log('Transmitting audio...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  // Stop transmitting audio when PTT button is released
  stopTransmitting() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      console.log('Stopped transmitting.');
    }
  }

  destroy() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export default new WebRTCService();