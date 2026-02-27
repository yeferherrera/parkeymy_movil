import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert, TouchableOpacity, Image, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNav from '../../../components/ui/nav';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const getMovimientoConfig = (tipo: string) => {
  return tipo === 'ingreso'
    ? { label: 'Ingreso', color: '#3CB371', bg: '#D1FAE5', icon: 'enter-outline' }
    : { label: 'Salida', color: '#E74C3C', bg: '#FEE2E2', icon: 'exit-outline' };
};

export default function HistorialMovimientosScreen() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [auditorias, setAuditorias] = useState<any[]>([]);

  useEffect(() => {
    fetchMovimientos();
    fetchAuditoria();
  }, []);

  const fetchMovimientos = async () => {
    try {
      const response = await api.get('/mis-movimientos');
      setMovimientos(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditoria = async () => {
  try {
    const response = await api.get('/mi-auditoria');

    console.log('AUDITORIA RAW:', response.data);

    // ✅ TU API devuelve el arreglo directo
    setAuditorias(Array.isArray(response.data) ? response.data : []);

  } catch (error) {
    console.log('Error auditoría:', error);
    setAuditorias([]); // 🛡️ blindaje
  }
};

  const toggleExpandir = (id: number) => {
    setExpandido(prev => prev === id ? null : id);
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
      <AppNav title="Historial" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de movimientos</Text>
        <Text style={styles.headerSubtitle}>
          {movimientos.length} movimiento{movimientos.length !== 1 ? 's' : ''} registrado{movimientos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {movimientos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>No tienes movimientos registrados</Text>
        </View>
      ) : (
        <FlatList
          data={movimientos}
          keyExtractor={(item) => String(item.id_movimiento)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const config = getMovimientoConfig(item.tipo_movimiento);
            const isExpanded = expandido === item.id_movimiento;
            const articulos = item.codigo_qr?.articulos || [];
           const auditoriasRelacionadas = (auditorias ?? []).filter((aud: any) =>
            Number(aud.id_usuario) === Number(item.id_usuario));

            const fecha = new Date(item.fecha);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpandir(item.id_movimiento)}
                activeOpacity={0.85}
              >
                {/* FRANJA LATERAL */}
                <View style={[styles.franja, { backgroundColor: config.color }]} />

                <View style={{ flex: 1 }}>
                  {/* FILA PRINCIPAL */}
                  <View style={styles.cardHeader}>
                    {/* Icono + tipo */}
                    <View style={[styles.iconBadge, { backgroundColor: config.bg }]}>
                      <Ionicons name={config.icon as any} size={20} color={config.color} />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.tipoText, { color: config.color }]}>
                        {config.label}
                      </Text>
                      <Text style={styles.fechaText}>
                        {fecha.toLocaleDateString('es-CO', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </Text>
                      <Text style={styles.horaText}>
                        🕐 {fecha.toLocaleTimeString('es-CO', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </Text>
                    </View>

                    {/* Cantidad artículos + flecha */}
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <View style={styles.cantBadge}>
                        <Text style={styles.cantText}>
                          {articulos.length} art.
                        </Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#9CA3AF"
                      />
                    </View>
                  </View>

                  {/* VIGILANTE */}
                  <View style={styles.vigilanteRow}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" />
                    <Text style={styles.vigilanteText}>
                      Validado por: {item.vigilante?.nombres} {item.vigilante?.apellidos}
                    </Text>
                  </View>

                  {/* ARTÍCULOS EXPANDIDOS */}
                  {isExpanded && articulos.length > 0 && (
                    <View style={styles.articulosContainer}>
                      <Text style={styles.articulosTitle}>Artículos en este movimiento:</Text>
                      {articulos.map((art: any) => (
                        <View key={art.id_articulo} style={styles.articuloItem}>
                          <Ionicons name="cube-outline" size={16} color="#004C97" />
                          <View style={{ marginLeft: 8, flex: 1 }}>
                            <Text style={styles.articuloNombre}>{art.nombre_articulo}</Text>
                            <Text style={styles.articuloSub}>
                              {art.marca} — {art.modelo}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* 🔔 NOTIFICACIONES */}
{isExpanded && auditoriasRelacionadas.length > 0 && (
  <View style={styles.notificacionesContainer}>
    <Text style={styles.notificacionesTitle}>
      Notificaciones:
    </Text>

    {auditoriasRelacionadas.map((aud: any) => (
      <View key={aud.id_auditoria} style={styles.notificacionItem}>
        <Ionicons name="notifications-outline" size={16} color="#F59E0B" />
        <Text style={styles.notificacionText}>
          {aud.tipo_operacion} — {new Date(aud.fecha_hora).toLocaleString('es-CO')}
        </Text>
      </View>
    ))}
  </View>
)}
                </View>
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

  header: {
    backgroundColor: '#004C97',
    paddingTop: 2,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 8,
  },

  headerTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  headerSubtitle: {
    textAlign: 'center',
    color: '#E0E7FF',
    marginTop: 6,
    fontSize: 14,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  franja: {
    width: 6,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },

  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipoText: {
    fontSize: 16,
    fontWeight: '700',
  },

  fechaText: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },

  horaText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },

  cantBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },

  cantText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004C97',
  },

  vigilanteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  vigilanteText: {
    fontSize: 12,
    color: '#6B7280',
  },

  articulosContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  articulosTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004C97',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  articuloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  articuloNombre: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  articuloSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  notificacionesContainer: {
  marginHorizontal: 16,
  marginBottom: 16,
  backgroundColor: '#FFFBEB',
  borderRadius: 12,
  padding: 12,
  borderWidth: 1,
  borderColor: '#FDE68A',
},

notificacionesTitle: {
  fontSize: 12,
  fontWeight: '700',
  color: '#B45309',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},

notificacionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
  gap: 6,
},

notificacionText: {
  fontSize: 12,
  color: '#92400E',
  flexShrink: 1,
},
});