import AppNav from '@/components/ui/nav';
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

interface Reporte {
  id_reporte: number;
  tipo_reporte: string;
  titulo: string;
  descripcion: string;
  estado: string;
  respuesta: string | null;
  fecha_reporte: string;
  fecha_respuesta: string | null;
  respondido_por: any;
}

const tipoConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  daño_articulo:     { icon: 'construct-outline',   color: '#D97706', bg: '#FEF3C7', label: 'Daño en artículo' },
  perdida_articulo:  { icon: 'alert-circle-outline', color: '#E74C3C', bg: '#FEE2E2', label: 'Pérdida de artículo' },
  incidente_sede:    { icon: 'warning-outline',      color: '#7C3AED', bg: '#F5F3FF', label: 'Incidente en sede' },
};

const estadoConfig: Record<string, { color: string; bg: string; label: string }> = {
  pendiente:    { color: '#D97706', bg: '#FEF3C7', label: 'Pendiente' },
  en_revision:  { color: '#004C97', bg: '#EFF6FF', label: 'En revisión' },
  resuelto:     { color: '#16A34A', bg: '#D1FAE5', label: 'Resuelto' },
};

export default function MisReportesScreen() {
  const router = useRouter();
  const [reportes, setReportes] = useState<Reporte[]>([]);
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
      const res = await api.get('/mis-reportes');
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
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppNav title="Mis reportes" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#004C97" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNav title="" />

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
          <Text style={styles.emptyText}>
            Aún no has creado ningún reporte. Toca el botón para crear uno.
          </Text>
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
              colors={['#004C97']}
            />
          }
          renderItem={({ item }) => {
            const tipo = tipoConfig[item.tipo_reporte] ?? tipoConfig.incidente_sede;
            const estado = estadoConfig[item.estado] ?? estadoConfig.pendiente;
            const isExpanded = expandido === item.id_reporte;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setExpandido(isExpanded ? null : item.id_reporte)}
                activeOpacity={0.85}
              >
                {/* FRANJA */}
                <View style={[styles.franja, { backgroundColor: tipo.color }]} />

                <View style={{ flex: 1 }}>
                  {/* CABECERA */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconWrap, { backgroundColor: tipo.bg }]}>
                      <Ionicons name={tipo.icon as any} size={22} color={tipo.color} />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
                      <Text style={styles.cardTipo}>{tipo.label}</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
                        <Text style={[styles.estadoText, { color: estado.color }]}>
                          {estado.label}
                        </Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16} color="#9CA3AF"
                      />
                    </View>
                  </View>

                  {/* FECHA */}
                  <View style={styles.fechaRow}>
                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    <Text style={styles.fechaText}>{formatFecha(item.fecha_reporte)}</Text>
                  </View>

                  {/* EXPANDIDO */}
                  {isExpanded && (
                    <View style={styles.expandido}>
                      <Text style={styles.expandLabel}>Descripción</Text>
                      <Text style={styles.expandText}>{item.descripcion}</Text>

                      {item.respuesta && (
                        <>
                          <View style={styles.respuestaDivider} />
                          <View style={styles.respuestaBox}>
                            <View style={styles.respuestaHeader}>
                              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#16A34A" />
                              <Text style={styles.respuestaLabel}>Respuesta oficial</Text>
                              {item.fecha_respuesta && (
                                <Text style={styles.respuestaFecha}>
                                  {formatFecha(item.fecha_respuesta)}
                                </Text>
                              )}
                            </View>
                            <Text style={styles.respuestaText}>{item.respuesta}</Text>
                          </View>
                        </>
                      )}

                      {!item.respuesta && (
                        <View style={styles.sinRespuesta}>
                          <Ionicons name="hourglass-outline" size={14} color="#9CA3AF" />
                          <Text style={styles.sinRespuestaText}>Esperando respuesta...</Text>
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
        onPress={() => router.push('/stackInterno/nuevoReporte')}
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

  franja: { width: 5 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 8,
  },

  iconWrap: {
    width: 44, height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  cardTitulo: { fontSize: 14, fontWeight: '700', color: '#111827' },
  cardTipo: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  estadoBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
  },
  estadoText: { fontSize: 11, fontWeight: '700' },

  fechaRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: 14, paddingBottom: 12,
  },
  fechaText: { fontSize: 12, color: '#9CA3AF' },

  expandido: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  expandLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginBottom: 4 },
  expandText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  respuestaDivider: {
    height: 1, backgroundColor: '#E5E7EB', marginVertical: 12,
  },

  respuestaBox: { gap: 6 },
  respuestaHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  respuestaLabel: { fontSize: 12, fontWeight: '700', color: '#16A34A', flex: 1 },
  respuestaFecha: { fontSize: 11, color: '#9CA3AF' },
  respuestaText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  sinRespuesta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginTop: 8,
  },
  sinRespuestaText: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },

  fab: {
    position: 'absolute',
    bottom: 24, right: 24,
    flexDirection: 'row',
    backgroundColor: '#004C97',
    paddingHorizontal:20,
    paddingVertical: 50,
    borderRadius: 30,
    alignItems: 'center',
    gap: 8,
    elevation: 30,
    shadowColor: '#004C97',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});