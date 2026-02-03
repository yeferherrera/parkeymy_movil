import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function WelcomeTitle() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a</Text>
      <Text style={styles.text}>Parkeymy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#004C97', // Azul SENA
    textAlign: 'center',
  },
});
