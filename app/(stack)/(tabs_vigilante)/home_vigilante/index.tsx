import { storage } from '@/services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,Platform } from 'react-native';
import ActionCard from '../../../../components/card/ActionCard';
import api from '../../../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function HomeVigilante() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [visitantesActivos, setVisitantesActivos] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, [])
  );

  const fetchDatos = async () => {
    try {
      const [perfilRes, visitantesRes] = await Promise.all([
        api.get('/perfil'),
        api.get('/visitantes'),
      ]);
      setUsuario(perfilRes.data.usuario);
      const activos = visitantesRes.data.filter((v: any) => v.estado === 'activo').length;
      setVisitantesActivos(activos);
    } catch {
      console.log('Error cargando datos vigilante');
    }
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

      {/* HEADER AZUL — fuera del ScrollView para que llegue de lado a lado */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/Logo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.name}>
          {usuario ? `${usuario.nombres} ${usuario.apellidos}` : '...'}
        </Text>
        <Text style={styles.role}>
          {usuario?.rol?.nombre_rol || 'Vigilante'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* BOTÓN VISITANTES */}
        <TouchableOpacity
          style={styles.visitantesBtn}
          onPress={() => router.push('/(stack)/stackVigilante/visitantes')}
          activeOpacity={0.85}
        >
          <View style={styles.visitantesBtnLeft}>
            <View style={styles.visitantesIcon}>
              <Ionicons name="people-outline" size={26} color="#1E3A5F" />
            </View>
            <View>
              <Text style={styles.visitantesBtnTitle}>Gestionar visitantes</Text>
              <Text style={styles.visitantesBtnSub}>Registrar ingreso y objetos</Text>
            </View>
          </View>
          <View style={styles.visitantesBtnRight}>
            {visitantesActivos > 0 && (
              <View style={styles.visitantesBadge}>
                <Text style={styles.visitantesBadgeText}>
                  {visitantesActivos} activo{visitantesActivos !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* GRID */}
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
            onPress={() => router.push('/stackVigilante/articulosFuera')}
            style={{ width: CARD_WIDTH }}
          />
          <ActionCard
            icon="question-circle"
            label="Ayuda"
            onPress={() => router.push('/stackVigilante/ayuda')}
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  // Header fuera del ScrollView — llega de lado a lado
  header: {
    backgroundColor: '#1E3A5F',
    width: '100%',
    paddingTop: 52,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },

  logo: {
    width: 170,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 16,
  },

  welcome: {
    fontSize: 22, fontWeight: '700',
    color: '#FFFFFF', textAlign: 'center',
  },

  name: {
    fontSize: 18, fontWeight: '600',
    color: '#E0F2FE', textAlign: 'center', marginTop: 4,
  },

  role: {
    fontSize: 13, color: '#A7F3D0',
    textAlign: 'center', marginTop: 4,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  visitantesBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
  },

  visitantesBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  visitantesIcon: {
    width: 50, height: 50,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  visitantesBtnTitle: {
    fontSize: 15, fontWeight: '700', color: '#111827',
  },

  visitantesBtnSub: {
    fontSize: 12, color: '#6B7280', marginTop: 2,
  },

  visitantesBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  visitantesBadge: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },

  visitantesBadgeText: {
    fontSize: 11, fontWeight: '700', color: '#16A34A',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
});