import React from 'react';
import { StyleSheet, View } from 'react-native';
import WalkieTalkieScreen from './src/screens/WalkieTalkie';

export default function App() {
  return (
    <View style={styles.container}>
      <WalkieTalkieScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});