import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import SocketService from '../services/socket';
import WebRTCService from '../services/webrtc';

export default function WalkieTalkieScreen() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // Connect to signaling server
    SocketService.connect();

    // Initialize WebRTC and handle incoming remote audio stream
    WebRTCService.init((remoteStream) => {
      console.log('Remote audio stream ready to play');
      // In React Native WebRTC, incoming audio tracks play automatically 
      // through the speaker if configured properly, or via a remote stream container.
    });

    setStatus('Connected & Ready');

    return () => {
      WebRTCService.destroy();
      SocketService.disconnect();
    };
  }, []);

  const handlePressIn = async () => {
    try {
      setIsTransmitting(true);
      setStatus('TRANSMITTING...');
      await WebRTCService.startTransmitting();
    } catch (error) {
      Alert.alert('Error', 'Could not access microphone');
      setIsTransmitting(false);
      setStatus('Connected & Ready');
    }
  };

  const handlePressOut = () => {
    setIsTransmitting(false);
    setStatus('Connected & Ready');
    WebRTCService.stopTransmitting();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mobile Walkie-Talkie</Text>
        <Text style={styles.statusText}>Status: {status}</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.pttButton, isTransmitting && styles.pttButtonActive]}
        >
          <Text style={styles.pttButtonText}>
            {isTransmitting ? 'TALKING...' : 'HOLD TO TALK'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pttButtonActive: {
    backgroundColor: '#2ed573',
    transform: [{ scale: 0.95 }],
  },
  pttButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});