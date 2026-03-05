import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';
import CustomInput from '@/components/input/customInput';
import api from '@/app/services/api';
import { useRouter } from 'expo-router';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/perfil');
      const u = res.data.usuario;
      setNombres(u.nombres ?? '');
      setApellidos(u.apellidos ?? '');
      setTelefono(u.telefono ?? '');
      setCorreo(u.correo_institucional ?? '');
    } catch {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!nombres.trim() || !apellidos.trim()) {
      Alert.alert('Error', 'Nombres y apellidos son obligatorios');
      return;
    }

    try {
      setGuardando(true);
      await api.put('/perfil', { nombres, apellidos, telefono, correo_institucional: correo });
      Alert.alert('✅ Éxito', 'Perfil actualizado correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNav title="Editar perfil" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <Text style={styles.headerSub}>Actualiza tu información personal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          <Text style={styles.seccion}>Datos personales</Text>

          <CustomInput
            label="Nombres"
            placeholder="Ej: Juan Carlos"
            value={nombres}
            onChangeText={setNombres}
          />
          <CustomInput
            label="Apellidos"
            placeholder="Ej: González Pérez"
            value={apellidos}
            onChangeText={setApellidos}
          />
          <CustomInput
            label="Teléfono"
            placeholder="Ej: 3001234567"
            value={telefono}
            onChangeText={setTelefono}
            // keyboardType="phone-pad"
          />
          <CustomInput
            label="Correo institucional"
            placeholder="correo@sena.edu.co"
            value={correo}
            onChangeText={setCorreo}
            // keyboardType="email-address"
            // autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, guardando && { opacity: 0.7 }]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>Guardar cambios</Text>
              </>
          }
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },

  header: {
    backgroundColor: '#004C97',
    paddingTop: 2,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 8,
  },
  headerTitle: { textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub: { textAlign: 'center', color: '#E0E7FF', marginTop: 6, fontSize: 14 },

  content: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  seccion: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 16 },

  btn: {
    backgroundColor: '#004C97',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});