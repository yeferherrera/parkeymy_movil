import { storage } from '@/services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../../../components/input/customInput';
import api from '../../../services/api';

const LoginScreen = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [modalContacto, setModalContacto] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        usuario: usuario.trim(),
        password: password.trim(),
      });

      const token = response.data.token;
      const user = response.data.usuario;

      if (!user) {
        alert('Respuesta inválida del servidor');
        return;
      }

      const rol = Number(user.id_rol);

      if (rol !== 2 && rol !== 4) {
  alert('Este acceso es solo para aprendices e instructores');
  return;
}

      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      router.replace('/(stack)/(tabs)/home');

    } catch (error: any) {
      console.log("🔴 Error en login:", error);
      alert('Credenciales incorrectas');
       console.log("🚨 ERROR COMPLETO:");
    console.log(error);
     console.log("📛 Error message:", error?.message);
    console.log("📛 Error name:", error?.name);
    }
  };

  return (
    <View style={styles.container}>

      {/* MODAL CONTACTO ADMIN */}
      <Modal
        visible={modalContacto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalContacto(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalContacto(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.modalCard}
          >
            {/* Ícono */}
            <View style={styles.modalIconWrap}>
              <Ionicons name="lock-closed-outline" size={32} color="#004C97" />
            </View>

            {/* Título */}
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <Text style={styles.modalSub}>
              Contacta al administrador del sistema para restablecer tu contraseña
            </Text>

            {/* Correo */}
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:yefersonyefersonherrera123@gmail.com')}
              style={styles.contactItem}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#EEF5FF' }]}>
                <Ionicons name="mail-outline" size={20} color="#004C97" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>CORREO</Text>
                <Text style={styles.contactValue} numberOfLines={1}>
                  yefersonyefersonherrera123@gmail.com
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Teléfono */}
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:+573176846802')}
              style={[styles.contactItem, { marginBottom: 24 }]}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="call-outline" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>TELÉFONO</Text>
                <Text style={styles.contactValue}>+57 317 684 6802</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Cerrar */}
            <TouchableOpacity
              onPress={() => setModalContacto(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* LOGO */}
      <Image
        source={require('../../../assets/images/Logo.png')}
        style={styles.image}
      />

      {/* INPUTS */}
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

      {/* BOTÓN LOGIN */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* BOTÓN VIGILANTES */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/login_vigilante')}
      >
        <Text style={styles.secondaryButtonText}>Acceso Vigilantes</Text>
      </TouchableOpacity>

      {/* RECUPERAR CONTRASEÑA */}
      <TouchableOpacity onPress={() => setModalContacto(true)}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
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
    width: 200, height: 90,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 50,
    resizeMode: 'contain',
  },

  button: {
    backgroundColor: '#004C97',
    height: 50, borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  secondaryButton: {
    height: 50, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#004C97',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 12, backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: { color: '#004C97', fontSize: 15, fontWeight: '600' },

  forgotText: {
    marginTop: 22,
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },

  modalIconWrap: {
    width: 64, height: 64,
    borderRadius: 20,
    backgroundColor: '#EEF5FF',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20, fontWeight: '800',
    color: '#111827', textAlign: 'center',
    marginBottom: 6,
  },

  modalSub: {
    fontSize: 14, color: '#6B7280',
    textAlign: 'center', marginBottom: 24,
    lineHeight: 20,
  },

  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#F8FAFC',
    borderRadius: 14, padding: 16,
    marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },

  contactIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  contactLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  contactValue: { fontSize: 13, color: '#111827', fontWeight: '600' },

  modalCloseBtn: {
    backgroundColor: '#004C97',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});