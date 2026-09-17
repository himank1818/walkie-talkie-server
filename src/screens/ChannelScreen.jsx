import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import socketService from '../services/socket';
import webRtcService from '../services/webrtc';
import PTTButton from '../components/PTTButton';

const ChannelScreen = () => {
  const [channelId, setChannelId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleJoinChannel = () => {
    if (channelId.trim() === '') return;

    // 1. Connect to signaling server
    socketService.connect();

    // 2. Initialize WebRTC and handle remote audio playback
    webRtcService.init((remoteStream) => {
      // Audio playback handling for remote stream if needed
      console.log('Received remote audio stream');
    });

    // 3. Join the specific channel room
    socketService.joinChannel(channelId);
    setIsConnected(true);
  };

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <View style={styles.joinContainer}>
          <Text style={styles.title}>Walkie-Talkie Connect</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Channel Name (e.g., kanpur-delhi)"
            placeholderTextColor="#888"
            value={channelId}
            onChangeText={setChannelId}
          />
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinChannel}>
            <Text style={styles.joinButtonText}>Join Channel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeContainer}>
          <Text style={styles.channelText}>Connected Channel: {channelId}</Text>
          {/* PTT Button for talking */}
          <PTTButton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  joinContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelText: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
  },
});

export default ChannelScreen;