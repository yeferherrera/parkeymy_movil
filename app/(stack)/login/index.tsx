import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../components/input/customInput';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require('../../../assets/images/Logo.png')}
        style={styles.image}
      />

      {/* Inputs */}
      <CustomInput
        label="Correo Electrónico"
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        label="Contraseña"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón login principal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Botón login vigilantes */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/login_vigilante')}
      >
        <Text style={styles.secondaryButtonText}>
          Acceso Vigilantes
        </Text>
      </TouchableOpacity>

      {/* Recuperar contraseña */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F4F6F8',
  },

  image: {
    width: 200,
    height: 90,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 50,
    resizeMode: 'contain',
  },

  button: {
    backgroundColor: '#004C97',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#004C97',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FFFFFF',
  },

  secondaryButtonText: {
    color: '#004C97',
    fontSize: 15,
    fontWeight: '600',
  },

  forgotText: {
    marginTop: 22,
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
  },
});
