import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
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

interface Visitante {
  id_visitante: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  empresa: string | null;
  motivo_visita: string;
  estado: string;
  fecha_expiracion: string | null;
}

export default function VisitantesScreen() {
  const router = useRouter();
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'activo' | 'expirado'>('todos');

  useFocusEffect(
    useCallback(() => {
      fetchVisitantes();
    }, [])
  );

  const fetchVisitantes = async () => {
    try {
      const res = await api.get('/visitantes');
      setVisitantes(res.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los visitantes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const visitantesFiltrados = visitantes.filter(v =>
    filtro === 'todos' ? true : v.estado === filtro
  );

  const tiempoRestante = (fecha: string) => {
    const diff = new Date(fecha).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expirado';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min restantes`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}min restantes`;
  };

  const estadoConfig: Record<string, { color: string; bg: string; label: string }> = {
    activo:   { color: '#16A34A', bg: '#D1FAE5', label: 'Activo' },
    expirado: { color: '#D97706', bg: '#FEF3C7', label: 'Expirado' },
    inactivo: { color: '#6B7280', bg: '#F3F4F6', label: 'Inactivo' },
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitantes</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* FILTROS */}
      <View style={styles.filtros}>
        {(['todos', 'activo', 'expirado'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroBtnActivo]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextActivo]}>
              {f === 'todos' ? 'Todos' : f === 'activo' ? 'Activos' : 'Expirados'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {visitantesFiltrados.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sin visitantes</Text>
          <Text style={styles.emptyText}>No hay visitantes en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={visitantesFiltrados}
          keyExtractor={item => String(item.id_visitante)}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchVisitantes(); }}
              colors={['#004C97']}
            />
          }
          renderItem={({ item }) => {
            const estado = estadoConfig[item.estado] ?? estadoConfig.inactivo;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push({ pathname: '/stackVigilante/detalleVisitante', params: { id: item.id_visitante } })}
                activeOpacity={0.85}
              >
                <View style={[styles.franja, { backgroundColor: estado.color }]} />

                <View style={styles.cardAvatar}>
                  <Text style={styles.cardAvatarText}>
                    {item.nombres.charAt(0)}{item.apellidos.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardNombre} numberOfLines={1}>
                      {item.nombres} {item.apellidos}
                    </Text>
                    <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
                      <Text style={[styles.estadoText, { color: estado.color }]}>
                        {estado.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardDoc}>
                    {item.tipo_documento} {item.numero_documento}
                  </Text>

                  {item.empresa && (
                    <Text style={styles.cardEmpresa}>{item.empresa}</Text>
                  )}

                  <Text style={styles.cardMotivo} numberOfLines={1}>
                    {item.motivo_visita}
                  </Text>

                  {item.estado === 'activo' && item.fecha_expiracion && (
                    <View style={styles.tiempoRow}>
                      <Ionicons name="time-outline" size={12} color="#D97706" />
                      <Text style={styles.tiempoText}>
                        {tiempoRestante(item.fecha_expiracion)}
                      </Text>
                    </View>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(stack)/stackVigilante/registrarVisitantes')}
        activeOpacity={0.85}
      >
        <Ionicons name="person-add-outline" size={22} color="#fff" />
        <Text style={styles.fabText}>Registrar visitante</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 52, paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  filtros: {
    flexDirection: 'row',
    gap: 8, padding: 16,
  },
  filtroBtn: {
    flex: 1, paddingVertical: 8,
    borderRadius: 99, backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  filtroBtnActivo: { backgroundColor: '#1E3A5F' },
  filtroText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filtroTextActivo: { color: '#fff' },

  empty: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', gap: 12, padding: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    marginBottom: 12, flexDirection: 'row',
    alignItems: 'center', overflow: 'hidden',
    elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    gap: 12, paddingRight: 14,
  },
  franja: { width: 5, alignSelf: 'stretch' },

  cardAvatar: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardAvatarText: { fontSize: 16, fontWeight: '800', color: '#004C97' },

  cardTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 2,
  },
  cardNombre: { fontSize: 14, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },

  estadoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  estadoText: { fontSize: 11, fontWeight: '700' },

  cardDoc: { fontSize: 12, color: '#6B7280' },
  cardEmpresa: { fontSize: 12, color: '#004C97', fontWeight: '600', marginTop: 2 },
  cardMotivo: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  tiempoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  tiempoText: { fontSize: 11, color: '#D97706', fontWeight: '600' },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    flexDirection: 'row', backgroundColor: '#1E3A5F',
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 30, alignItems: 'center', gap: 8,
    elevation: 6, shadowColor: '#1E3A5F',
    shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});