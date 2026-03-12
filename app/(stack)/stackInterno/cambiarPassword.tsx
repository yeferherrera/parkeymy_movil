import CustomInput from '@/components/input/customInput';
import AppNav from '@/components/ui/nav';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Paso = 'solicitar' | 'verificar';

export default function CambiarPasswordScreen() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>('solicitar');
  const [cargando, setCargando] = useState(false);

  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleSolicitar = async () => {
    try {
      setCargando(true);
      await api.post('/solicitar-cambio-password');
      Alert.alert(
        '📧 Código enviado',
        'Revisa tu correo institucional. El código expira en 10 minutos.',
        [{ text: 'OK', onPress: () => setPaso('verificar') }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo enviar el código');
    } finally {
      setCargando(false);
    }
  };

  const handleCambiar = async () => {
    if (codigo.length !== 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos');
      return;
    }
    if (nuevaPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setCargando(true);
      await api.post('/cambiar-password', {
        codigo,
        nueva_password: nuevaPassword,
        nueva_password_confirmation: confirmarPassword,
      });
      Alert.alert(
        '✅ Contraseña actualizada',
        'Tu contraseña fue cambiada correctamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo cambiar la contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppNav title="Cambiar contraseña" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cambiar contraseña</Text>
        <Text style={styles.headerSub}>Verificación en dos pasos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* PASOS INDICADORES */}
        <View style={styles.pasosRow}>
          <View style={styles.pasoItem}>
            <View style={[styles.pasoBadge, paso === 'solicitar' ? styles.pasoActivo : styles.pasoDone]}>
              {paso === 'verificar'
                ? <Ionicons name="checkmark" size={16} color="#fff" />
                : <Text style={styles.pasoNum}>1</Text>
              }
            </View>
            <Text style={styles.pasoLabel}>Solicitar</Text>
          </View>

          <View style={styles.pasoLinea} />

          <View style={styles.pasoItem}>
            <View style={[styles.pasoBadge, paso === 'verificar' ? styles.pasoActivo : styles.pasoPendiente]}>
              <Text style={styles.pasoNum}>2</Text>
            </View>
            <Text style={styles.pasoLabel}>Verificar</Text>
          </View>
        </View>

        {paso === 'solicitar' ? (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <Ionicons name="mail-outline" size={48} color="#004C97" />
            </View>
            <Text style={styles.cardTitle}>Verificación por correo</Text>
            <Text style={styles.cardDesc}>
              Te enviaremos un código de 6 dígitos a tu correo institucional para confirmar tu identidad.
            </Text>

            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#16A34A" />
              <Text style={styles.infoText}>
                Este proceso protege tu cuenta con autenticación de dos factores (2FA)
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.btn, cargando && { opacity: 0.7 }]}
              onPress={handleSolicitar}
              disabled={cargando}
            >
              {cargando
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="send-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Enviar código</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <Ionicons name="lock-open-outline" size={48} color="#D97706" />
            </View>
            <Text style={styles.cardTitle}>Ingresa el código</Text>
            <Text style={styles.cardDesc}>
              Revisa tu correo institucional e ingresa el código de 6 dígitos.
            </Text>

            <CustomInput
              label="Código de verificación"
              placeholder="000000"
              value={codigo}
              onChangeText={(t) => setCodigo(t.replace(/\D/g, '').slice(0, 6))}
            //   keyboardType="number-pad"
            />

            <CustomInput
              label="Nueva contraseña"
              placeholder="Mínimo 8 caracteres"
              value={nuevaPassword}
              onChangeText={setNuevaPassword}
              secureTextEntry
            />

            <CustomInput
              label="Confirmar contraseña"
              placeholder="Repite la contraseña"
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#D97706' }, cargando && { opacity: 0.7 }]}
              onPress={handleCambiar}
              disabled={cargando}
            >
              {cargando
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Cambiar contraseña</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reenviarBtn}
              onPress={() => { setPaso('solicitar'); setCodigo(''); }}
            >
              <Text style={styles.reenviarText}>¿No recibiste el código? Reenviar</Text>
            </TouchableOpacity>
          </View>
        )}

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

  pasosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 0,
  },
  pasoItem: { alignItems: 'center', gap: 6 },
  pasoBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  pasoActivo: { backgroundColor: '#004C97' },
  pasoDone: { backgroundColor: '#16A34A' },
  pasoPendiente: { backgroundColor: '#D1D5DB' },
  pasoNum: { fontSize: 15, fontWeight: '800', color: '#fff' },
  pasoLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  pasoLinea: {
    width: 60, height: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
    marginHorizontal: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  iconCenter: { alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 20 },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: '#16A34A', fontWeight: '600', lineHeight: 18 },

  btn: {
    backgroundColor: '#004C97',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  reenviarBtn: { alignItems: 'center', marginTop: 16 },
  reenviarText: { fontSize: 13, color: '#004C97', fontWeight: '600', textDecorationLine: 'underline' },
});