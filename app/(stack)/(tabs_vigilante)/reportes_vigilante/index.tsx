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

interface ReporteVigilancia {
  id_reporte: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  total_ingresos: number;
  total_salidas: number;
  total_articulos_registrados: number;
  total_vehiculos_registrados: number;
  incidentes_reportados: number;
  observaciones: string | null;
  estado_reporte: string;
}

export default function ReportesVigilanteScreen() {
  const router = useRouter();
  const [reportes, setReportes] = useState<ReporteVigilancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchReportes();
    }, [])
  );

  const fetchReportes = async () => {
    try {
      const res = await api.get('/mis-reportes-vigilancia');
      setReportes(res.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis reportes</Text>
        <Text style={styles.headerSub}>
          {reportes.length} reporte{reportes.length !== 1 ? 's' : ''} registrado{reportes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {reportes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sin reportes</Text>
          <Text style={styles.emptyText}>Aún no has creado ningún reporte de turno.</Text>
        </View>
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={item => String(item.id_reporte)}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchReportes(); }}
              colors={['#16A34A']}
            />
          }
          renderItem={({ item }) => {
            const isExpanded = expandido === item.id_reporte;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setExpandido(isExpanded ? null : item.id_reporte)}
                activeOpacity={0.85}
              >
                <View style={styles.franja} />
                <View style={{ flex: 1 }}>

                  {/* CABECERA */}
                  <View style={styles.cardHeader}>
                    <View style={styles.iconWrap}>
                      <Ionicons name="shield-checkmark-outline" size={22} color="#16A34A" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitulo}>Reporte #{item.id_reporte}</Text>
                      <Text style={styles.cardFecha}>{formatFecha(item.fecha_hora_inicio)}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <View style={styles.estadoBadge}>
                        <Text style={styles.estadoText}>{item.estado_reporte}</Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16} color="#9CA3AF"
                      />
                    </View>
                  </View>

                  {/* STATS RÁPIDOS */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name="log-in-outline" size={14} color="#16A34A" />
                      <Text style={styles.statNum}>{item.total_ingresos}</Text>
                      <Text style={styles.statLabel}>Ingresos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Ionicons name="log-out-outline" size={14} color="#E74C3C" />
                      <Text style={styles.statNum}>{item.total_salidas}</Text>
                      <Text style={styles.statLabel}>Salidas</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Ionicons name="cube-outline" size={14} color="#004C97" />
                      <Text style={styles.statNum}>{item.total_articulos_registrados}</Text>
                      <Text style={styles.statLabel}>Artículos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Ionicons name="warning-outline" size={14} color="#D97706" />
                      <Text style={styles.statNum}>{item.incidentes_reportados}</Text>
                      <Text style={styles.statLabel}>Incidentes</Text>
                    </View>
                  </View>

                  {/* EXPANDIDO */}
                  {isExpanded && (
                    <View style={styles.expandido}>
                      <View style={styles.expandRow}>
                        <Text style={styles.expandLabel}>Inicio turno</Text>
                        <Text style={styles.expandValue}>{formatFecha(item.fecha_hora_inicio)}</Text>
                      </View>
                      <View style={styles.expandRow}>
                        <Text style={styles.expandLabel}>Fin turno</Text>
                        <Text style={styles.expandValue}>{formatFecha(item.fecha_hora_fin)}</Text>
                      </View>
                      <View style={styles.expandRow}>
                        <Text style={styles.expandLabel}>Vehículos</Text>
                        <Text style={styles.expandValue}>{item.total_vehiculos_registrados}</Text>
                      </View>
                      {item.observaciones && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={styles.expandLabel}>Observaciones</Text>
                          <Text style={styles.observacionesText}>{item.observaciones}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/stackVigilante/nuevoReporteVigilante')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.fabText}>Nuevo reporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 8,
  },
  headerTitle: { textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub: { textAlign: 'center', color: '#93C5FD', marginTop: 6, fontSize: 14 },

  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  franja: { width: 5, backgroundColor: '#16A34A' },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 8,
  },

  iconWrap: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardFecha: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  estadoBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
  },
  estadoText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },
  statNum: { fontSize: 16, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },

  expandido: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  expandValue: { fontSize: 13, color: '#111827', fontWeight: '700' },
  observacionesText: { fontSize: 13, color: '#374151', lineHeight: 20, marginTop: 4 },

  fab: {
    position: 'absolute',
    bottom: 24, right: 24,
    flexDirection: 'row',
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: '#16A34A',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});