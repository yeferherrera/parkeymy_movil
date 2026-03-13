import api from '@/services/api';
import { storage } from '@/services/storage';
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [sinLeer, setSinLeer] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, [])
  );

  const fetchDatos = async () => {
    try {
      const [notifRes, perfilRes] = await Promise.all([
        api.get('/notificaciones/sin-leer'),
        api.get('/perfil'),
      ]);
      setSinLeer(notifRes.data.sin_leer ?? 0);
      setNombreUsuario(perfilRes.data.usuario?.nombres ?? '');
    } catch (_) {}
  };

 const cerrarSesion = async () => {
  if (Platform.OS === 'web') {
    const confirmado = window.confirm('¿Estás seguro que deseas cerrar sesión?');
    if (!confirmado) return;
    try { await api.post('/logout'); } catch (_) {}
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    router.replace('/login');
    return;
  }
   Alert.alert(
    'Cerrar sesión',
    '¿Estás seguro que deseas cerrar sesión?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try { await api.post('/logout'); } catch (_) {}
          await storage.deleteItem('token');
          await storage.deleteItem('user');
          router.replace('/login');
        }
      }
    ]
  );
};
  return (
    <View style={styles.container}>

      {/* FONDO CABECERA */}
      <View style={styles.headerBackground} />

      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* FILA SUPERIOR — campana a la derecha  con espacio para centrar el logo*/}
        <View style={styles.topRow}>
          <View style={{ width: 44 }} />  
          <Image
            source={require('../../../../assets/images/Logo.png')}
            style={styles.logo}
          />
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/stackInterno/notificaciones')}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {sinLeer > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {sinLeer > 9 ? '9+' : sinLeer}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* BIENVENIDA — debajo del logo con más espacio */}
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeSub}>Bienvenido de vuelta 👋</Text>
          <Text style={styles.welcomeName}>
            {nombreUsuario ? `¡Hola, ${nombreUsuario}!` : '¡Hola!'}
          </Text>
        </View>

      </SafeAreaView>

      {/* BOTONES */}
      <View style={styles.content}>

        {/* FILA 1 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/stackInterno/registrarArticulo')}
          >
            <MaterialIcons name="edit" size={28} color="#fff" />
            <Text style={styles.text}>Registrar artículo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/stackInterno/generarQR')}
          >
            <FontAwesome5 name="qrcode" size={28} color="#fff" />
            <Text style={styles.text}>Generar QR</Text>
          </TouchableOpacity>
        </View>

        {/* FILA 2 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/stackInterno/consultarRegistros')}
          >
            <Ionicons name="search-outline" size={28} color="#fff" />
            <Text style={styles.text}>Consultar registros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/stackInterno/reportes')}
          >
            <MaterialIcons name="list-alt" size={28} color="#fff" />
            <Text style={styles.text}>Mis reportes</Text>
          </TouchableOpacity>
        </View>

        {/* FILA FINAL */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push('/stackInterno/ayuda')}
          >
            <Ionicons name="help-circle-outline" size={26} color="#004C97" />
            <Text style={styles.textSecondary}>Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonSecondary, styles.logout]}
            onPress={cerrarSesion}
          >
            <MaterialIcons name="logout" size={26} color="#DC2626" />
            <Text style={[styles.textSecondary, styles.logoutText]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  headerBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 260,
    backgroundColor: '#004C97',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  safeArea: {
    width: '100%',
  },

  // Fila superior: placeholder | logo | campana
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  logo: {
    width: 180,
    height: 65,
    resizeMode: 'contain',
    paddingTop  : 100,
    borderRadius: 50,
  },

  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#004C97',
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },

  // Bienvenida centrada debajo del logo
  welcomeRow: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    
  },

  welcomeSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  welcomeName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.4,
    marginTop: 4,
  },

  content: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#004C97',
    width: '48%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#004C97',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  logout: { borderColor: '#FCA5A5' },

  text: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  textSecondary: {
    marginTop: 6,
    color: '#004C97',
    fontSize: 14,
    fontWeight: '600',
  },

  logoutText: { color: '#DC2626' },
});
