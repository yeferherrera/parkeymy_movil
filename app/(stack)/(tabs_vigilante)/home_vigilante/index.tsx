import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import ActionCard from '../../../../components/card/ActionCard';
import api from '../../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function HomeVigilante() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const response = await api.get('/perfil');
      setUsuario(response.data.usuario);
    } catch (error) {
      console.log('Error cargando perfil vigilante');
    }
  };

  const cerrarSesion = () => {
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
            await SecureStore.deleteItemAsync('token');
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerBackground} />

      {/* LOGO */}
      <Image
        source={require('@/assets/images/Logo.png')}
        style={styles.logo}
      />

      {/* BIENVENIDA */}
      <Text style={styles.welcome}>Bienvenido</Text>
      <Text style={styles.name}>
        {usuario ? `${usuario.nombres} ${usuario.apellidos}` : '...'}
      </Text>
      <Text style={styles.role}>
        {usuario?.rol?.nombre_rol || 'Vigilante'}
      </Text>

      {/* BOTÓN PRINCIPAL */}
      <TouchableOpacity
        style={styles.mainAction}
        onPress={() => router.push('/(stack)/(tabs_vigilante)/validarQr')}
        activeOpacity={0.85}
      >
        <FontAwesome5 name="qrcode" size={32} color="#FFFFFF" />
        <Text style={styles.mainActionText}>Validar código QR</Text>
      </TouchableOpacity>

      {/* GRID DE ACCIONES */}
      <View style={styles.grid}>

        <ActionCard 
          icon="clipboard-list"
          label="Reportes"
          onPress={() => router.push('/(stack)/(tabs_vigilante)/reportes_vigilante')}
          style={{ width: CARD_WIDTH }}
        />

        <ActionCard
          icon="history"
          label="Artículos fuera"
          onPress={() => router.push('/(stack)/stackVigilante/articulosFuera')}
          style={{ width: CARD_WIDTH }}
        />

        <ActionCard
          icon="question-circle"
          label="Ayuda"
          onPress={() => router.push('/(stack)/stackVigilante/ayuda')}
          style={{ width: CARD_WIDTH }}
        />

        <ActionCard
          icon="sign-out-alt"
          label="Cerrar sesión"
          danger
          onPress={cerrarSesion}
          style={{ width: CARD_WIDTH }}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
  },

  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 210,
    backgroundColor: '#004C97',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  logo: {
    marginTop: 50,
    width: 170,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 12,
  },

  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0F2FE',
    textAlign: 'center',
    marginTop: 4,
  },

  role: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    marginBottom: 28,
  },

  mainAction: {
    marginTop: 20,
    backgroundColor: '#16A34A',
    borderRadius: 38,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },

  mainActionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
});