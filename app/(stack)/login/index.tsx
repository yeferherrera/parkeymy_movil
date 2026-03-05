import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../components/input/customInput';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';

const LoginScreen =  () => {
  
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  console.log("BOTÓN PRESIONADO");

  try {
    console.log('BASE URL:', api.defaults.baseURL);
console.log('BODY:', {
  usuario,
  password
});
    console.log("Enviando login...");

    const response = await api.post('/login', {
      
      usuario: usuario.trim(),
      password: password.trim(),
    });

    console.log("RESPUESTA COMPLETA:", response.data);

    const token = response.data.token;
    const user = response.data.usuario;

    if (!user) {
      Alert.alert('Error', 'Respuesta inválida del servidor');
      return;
    }

    const rol = Number(user.id_rol);
    console.log("ROL DETECTADO:", rol);

    // ✅ SOLO aprendices pueden entrar aquí
    if (rol !== 2) {
      Alert.alert('Acceso denegado', 'Este acceso es solo para aprendices');
      return; 
    }

    // ✅ GUARDAR SOLO SI ES APRENDIZ
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));

    // 🚀 navegar
    router.replace('/(stack)/(tabs)/home');

  } catch (error: any) {
    console.log("ERROR LOGIN COMPLETO:", error);
    console.log("ERROR RESPONSE:", error?.response?.data);
    console.log("ERROR STATUS:", error?.response?.status);

    Alert.alert('Error', 'Credenciales incorrectas');
  }
};

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require('../../../assets/images/Logo.png')}
        style={styles.image}
      />

      {/* Inputs */}
      <CustomInput
        label="Correo institucional"
        placeholder="Correo institucional"
        value={usuario}
        onChangeText={setUsuario}
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
        onPress={handleLogin}
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