import AppNav from '@/components/ui/nav';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Notificacion {
  id_notificacion: number;
  tipo_notificacion: string;
  titulo: string;
  mensaje: string;
  fecha_envio: string;
  leida: number;
}

const iconoTipo: Record<string, { icon: string; color: string; bg: string }> = {
  articulo:    { icon: 'cube-outline',              color: '#004C97', bg: '#EFF6FF' },
  sistema:     { icon: 'settings-outline',          color: '#7C3AED', bg: '#F5F3FF' },
  incidente:   { icon: 'warning-outline',           color: '#E74C3C', bg: '#FEE2E2' },
  sancion:     { icon: 'ban-outline',               color: '#D97706', bg: '#FEF3C7' },
  parqueadero: { icon: 'car-outline',               color: '#16A34A', bg: '#D1FAE5' },
};

export default function NotificacionesScreen() {
  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchNotifs();
    }, [])
  );

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notificaciones');
      setNotifs(res.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const marcarLeida = async (id: number) => {
    try {
      await api.post(`/notificaciones/${id}/leer`);
      setNotifs(prev =>
        prev.map(n => n.id_notificacion === id ? { ...n, leida: 1 } : n)
      );
    } catch {}
  };

  const marcarTodasLeidas = async () => {
    try {
      await api.post('/notificaciones/leer-todas');
      setNotifs(prev => prev.map(n => ({ ...n, leida: 1 })));
    } catch {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const sinLeer = notifs.filter(n => n.leida === 0).length;

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = Math.floor((ahora.getTime() - d.getTime()) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppNav title="Notificaciones" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#004C97" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNav title="Notificaciones" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <Text style={styles.headerSub}>
            {sinLeer > 0 ? `${sinLeer} sin leer` : 'Todo al día'}
          </Text>
        </View>
        {sinLeer > 0 && (
          <TouchableOpacity
            style={styles.marcarBtn}
            onPress={marcarTodasLeidas}
          >
            <Ionicons name="checkmark-done-outline" size={18} color="#004C97" />
            <Text style={styles.marcarText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifs.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>
          <Text style={styles.emptyText}>
            Aquí aparecerán tus alertas de artículos y movimientos
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={item => String(item.id_notificacion)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchNotifs(); }}
              colors={['#004C97']}
            />
          }
          renderItem={({ item }) => {
            const tipo = iconoTipo[item.tipo_notificacion] ?? iconoTipo.sistema;
            const noLeida = item.leida === 0;

            return (
              <TouchableOpacity
                style={[styles.card, noLeida && styles.cardNoLeida]}
                onPress={() => noLeida && marcarLeida(item.id_notificacion)}
                activeOpacity={0.85}
              >
                {/* Franja izquierda si no leída */}
                {noLeida && <View style={[styles.franja, { backgroundColor: tipo.color }]} />}

                {/* Icono */}
                <View style={[styles.iconWrap, { backgroundColor: tipo.bg }]}>
                  <Ionicons name={tipo.icon as any} size={22} color={tipo.color} />
                </View>

                {/* Contenido */}
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.titulo, noLeida && styles.tituloNoLeido]} numberOfLines={1}>
                      {item.titulo}
                    </Text>
                    <Text style={styles.fecha}>{formatFecha(item.fecha_envio)}</Text>
                  </View>
                  <Text style={styles.mensaje} numberOfLines={2}>
                    {item.mensaje}
                  </Text>
                </View>

                {/* Punto no leído */}
                {noLeida && <View style={[styles.dot, { backgroundColor: tipo.color }]} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: '#004C97',
    paddingTop: 2,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub: { color: '#E0E7FF', fontSize: 13, marginTop: 4 },

  marcarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
  },
  marcarText: { fontSize: 13, fontWeight: '700', color: '#004C97' },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    gap: 12,
  },

  cardNoLeida: {
    backgroundColor: '#FAFBFF',
    elevation: 4,
  },

  franja: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 6,
  },

  cardBody: { flex: 1 },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  titulo: { fontSize: 14, fontWeight: '600', color: '#374151', flex: 1, marginRight: 8 },
  tituloNoLeido: { fontWeight: '800', color: '#111827' },

  fecha: { fontSize: 11, color: '#9CA3AF', flexShrink: 0 },

  mensaje: { fontSize: 13, color: '#6B7280', lineHeight: 18 },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
});