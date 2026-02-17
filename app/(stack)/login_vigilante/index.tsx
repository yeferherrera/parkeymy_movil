import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '@/components/input/customInput';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginVigilante() {
  const router = useRouter();

  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>


      <Image
              source={require('../../../assets/images/Logo.png')}
              style={styles.image}
            />          

      {/* Icono / Logo */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={42} color="#003A73" />
        <Text style={styles.title}>Acceso Vigilantes</Text>
        <Text style={styles.subtitle}>
          Uso exclusivo para personal autorizado
        </Text>
      </View>

      {/* Documento */}
      <CustomInput
        label="Número de documento"
        placeholder="Ej: 1104805904"
        value={documento}
        onChangeText={setDocumento}
        
      />

      {/* Contraseña */}
      <CustomInput
        label="Contraseña"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón ingresar */}
      <TouchableOpacity style={styles.button} 
      onPress={()=> router.replace('../(tabs_vigilante)/home_vigilante')}
      >

        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Volver al login principal */}
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.backText}>
          Volver al inicio de sesión
        </Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F4F6F8',
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003A73',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

   image: {
    width: 1000,
    height: 90,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 30,
    resizeMode: 'contain',
  },


  button: {
    backgroundColor: '#003A73',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backText: {
    marginTop: 22,
    textAlign: 'center',
    color: '#004C97',
    fontSize: 14,
  },
});
