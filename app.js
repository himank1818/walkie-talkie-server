import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import WebRTCService from './src/services/webrtc';

export default function App() {
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [statusText, setStatusText] = useState('Disconnected');
  const [remoteStream, setRemoteStream] = useState(null);

  // Room join karne ka function
  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a valid channel/room name');
      return;
    }

    setIsInRoom(true);
    setStatusText(`Joined Room: ${roomId}. Waiting for peer...`);

    // WebRTC initialize karein aur remote audio callback set karein
    WebRTCService.init(roomId.trim(), (stream) => {
      setRemoteStream(stream);
      setStatusText('Connected & Receiving Audio 🎧');
    });
  };

  // PTT Button Press (Bolna shuru karein)
  const handlePressIn = () => {
    WebRTCService.startTransmitting(
      () => {
        setIsTransmitting(true);
        setStatusText('Transmitting Voice... 🔴');
      },
      (error) => {
        Alert.alert('Microphone Error', 'Could not access microphone.');
        setStatusText('Mic Permission Error');
      }
    );
  };

  // PTT Button Release (Bolna band karein)
  const handlePressOut = () => {
    WebRTCService.stopTransmitting();
    setIsTransmitting(false);
    setStatusText(`Connected in Room: ${roomId}`);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎙️ Mobile Walkie-Talkie</Text>
        <Text style={styles.statusText}>Status: {statusText}</Text>
      </View>

      {/* Main Body: Room Join Screen or PTT Screen */}
      {!isInRoom ? (
        <View style={styles.roomContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>Enter Channel / Room Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., room123"
              placeholderTextColor="#666"
              value={roomId}
              onChangeText={setRoomId}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinRoom}>
              <Text style={styles.joinButtonText}>Connect Channel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.pttContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.pttButton,
              { backgroundColor: isTransmitting ? '#2ed573' : '#ff4757' },
            ]}
          >
            <Text style={styles.pttButtonText}>
              {isTransmitting ? 'TRANSMITTING' : 'HOLD TO TALK'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructionText}>Press and hold the button to speak</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#a4b0be',
    textAlign: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  roomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3742fa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3742fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pttContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButton: {
    width: 210,
    height: 210,
    borderRadius: 105,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  pttButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructionText: {
    color: '#747d8c',
    fontSize: 14,
    marginTop: 40,
  },
});