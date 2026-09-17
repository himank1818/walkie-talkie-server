import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import webRtcService from '../services/webrtc';

const PTTButton = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handlePressIn = () => {
    setIsTransmitting(true);
    webRtcService.startSpeaking();
  };

  const handlePressOut = () => {
    setIsTransmitting(false);
    webRtcService.stopSpeaking();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.pttButton, isTransmitting ? styles.transmitting : styles.idle]}
      >
        <Text style={styles.buttonText}>
          {isTransmitting ? 'TRANSMITTING...' : 'HOLD TO TALK'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  idle: {
    backgroundColor: '#3498db', // Blue when listening / idle
  },
  transmitting: {
    backgroundColor: '#e74c3c', // Red when actively talking
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PTTButton;