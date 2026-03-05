import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNav from '../../../components/ui/nav';
import api from '../../services/api';

const getMovimientoConfig = (tipo: string) => {
  return tipo === 'ingreso'
    ? { label: 'Ingreso', color: '#3CB371', bg: '#D1FAE5', icon: 'enter-outline' }
    : { label: 'Salida', color: '#E74C3C', bg: '#FEE2E2', icon: 'exit-outline' };
};

const getAuditoriaConfig = (tipo: string) => {
  switch (tipo) {
    case 'INSERT': return { label: 'Creado', color: '#3498DB', bg: '#EFF6FF', icon: 'add-circle-outline' };
    case 'UPDATE': return { label: 'Editado', color: '#F39C12', bg: '#FEF3C7', icon: 'create-outline' };
    case 'DELETE': return { label: 'Eliminado', color: '#E74C3C', bg: '#FEE2E2', icon: 'trash-outline' };
    default: return { label: tipo, color: '#888', bg: '#F3F4F6', icon: 'ellipse-outline' };
  }
};

type Pestana = 'movimientos' | 'auditoria';

export default function HistorialScreen() {
  const [pestana, setPestana] = useState<Pestana>('movimientos');
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [auditoria, setAuditoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    setLoading(true);
    try {
      const [movRes, audRes] = await Promise.all([
        api.get('/mis-movimientos'),
        api.get('/mi-auditoria'),
      ]);
      setMovimientos(movRes.data.data);
      setAuditoria(audRes.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
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

  const renderMovimiento = ({ item }: any) => {
    const config = getMovimientoConfig(item.tipo_movimiento);
    const isExpanded = expandido === item.id_movimiento;
    const articulos = item.codigo_qr?.articulos || [];
    const fecha = new Date(item.fecha);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleExpandir(item.id_movimiento)}
        activeOpacity={0.85}
      >
        <View style={[styles.franja, { backgroundColor: config.color }]} />
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon as any} size={20} color={config.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.tipoText, { color: config.color }]}>{config.label}</Text>
              <Text style={styles.fechaText}>
                {fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <Text style={styles.horaText}>
                🕐 {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View style={styles.cantBadge}>
                <Text style={styles.cantText}>{articulos.length} art.</Text>
              </View>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
            </View>
          </View>

          <View style={styles.subRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" />
            <Text style={styles.subText}>
              Validado por: {item.vigilante?.nombres} {item.vigilante?.apellidos}
            </Text>
          </View>

          {isExpanded && articulos.length > 0 && (
            <View style={styles.expandido}>
              <Text style={styles.expandidoTitle}>Artículos en este movimiento:</Text>
              {articulos.map((art: any) => (
                <View key={art.id_articulo} style={styles.articuloItem}>
                  <Ionicons name="cube-outline" size={16} color="#004C97" />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.articuloNombre}>{art.nombre_articulo}</Text>
                    <Text style={styles.articuloSub}>{art.marca} — {art.modelo}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAuditoria = ({ item }: any) => {
    const config = getAuditoriaConfig(item.tipo_operacion);
    const isExpanded = expandido === item.id_auditoria + 1000;
    const fecha = new Date(item.fecha_hora);

    let datosNuevos: any = null;
    let datosAnteriores: any = null;

    try {
      datosNuevos = item.datos_nuevos ? JSON.parse(item.datos_nuevos) : null;
      datosAnteriores = item.datos_anteriores && item.datos_anteriores !== 'null'
        ? JSON.parse(item.datos_anteriores) : null;
    } catch (_) {}

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleExpandir(item.id_auditoria + 1000)}
        activeOpacity={0.85}
      >
        <View style={[styles.franja, { backgroundColor: config.color }]} />
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon as any} size={20} color={config.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.tipoText, { color: config.color }]}>{config.label}</Text>
              <Text style={styles.fechaText}>
                {datosNuevos?.nombre_articulo || datosAnteriores?.nombre_articulo || 'Artículo'}
              </Text>
              <Text style={styles.horaText}>
                🕐 {fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })} — {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
          </View>

          <View style={styles.subRow}>
            <Ionicons name="hardware-chip-outline" size={14} color="#6B7280" />
            <Text style={styles.subText}>ID artículo: #{item.id_registro} — IP: {item.ip_address}</Text>
          </View>

          {isExpanded && (
            <View style={styles.expandido}>
              {item.tipo_operacion === 'UPDATE' && datosAnteriores && (
                <>
                  <Text style={styles.expandidoTitle}>Antes:</Text>
                  {datosAnteriores.nombre_articulo && (
                    <Text style={styles.articuloSub}>Nombre: {datosAnteriores.nombre_articulo}</Text>
                  )}
                  {datosAnteriores.descripcion && (
                    <Text style={styles.articuloSub}>Descripción: {datosAnteriores.descripcion}</Text>
                  )}
                  <Text style={[styles.expandidoTitle, { marginTop: 8 }]}>Después:</Text>
                </>
              )}
              {datosNuevos && (
                <>
                  {datosNuevos.nombre_articulo && (
                    <Text style={styles.articuloSub}>Nombre: {datosNuevos.nombre_articulo}</Text>
                  )}
                  {datosNuevos.descripcion && (
                    <Text style={styles.articuloSub}>Descripción: {datosNuevos.descripcion}</Text>
                  )}
                  {datosNuevos.marca && (
                    <Text style={styles.articuloSub}>Marca: {datosNuevos.marca} — Modelo: {datosNuevos.modelo}</Text>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const dataActual = pestana === 'movimientos' ? movimientos : auditoria;
  const keyActual = pestana === 'movimientos' ? 'id_movimiento' : 'id_auditoria';

  return (
    <View style={styles.container}>
      <AppNav title="Historial" />

      {/* HEADER */}
      <View style={styles.header}>
        
    
        {/* PESTAÑAS */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, pestana === 'movimientos' && styles.tabActive]}
            onPress={() => { setPestana('movimientos'); setExpandido(null); }}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color={pestana === 'movimientos' ? '#fff' : '#93C5FD'} />
            <Text style={[styles.tabText, pestana === 'movimientos' && styles.tabTextActive]}>
              Movimientos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, pestana === 'auditoria' && styles.tabActive]}
            onPress={() => { setPestana('auditoria'); setExpandido(null); }}
          >
            <Ionicons name="document-text-outline" size={16} color={pestana === 'auditoria' ? '#fff' : '#93C5FD'} />
            <Text style={[styles.tabText, pestana === 'auditoria' && styles.tabTextActive]}>
              Artículos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {dataActual.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>No hay registros aún</Text>
        </View>
      ) : (
        <FlatList
          data={dataActual}
          keyExtractor={(item) => String(item[keyActual])}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={pestana === 'movimientos' ? renderMovimiento : renderAuditoria}
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

  headerTitle: { textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: '700' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    marginTop: 14,
    padding: 4,
    gap: 4,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },

  tabActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabText: { color: '#93C5FD', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#fff' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { color: '#9CA3AF', fontSize: 15 },

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

  franja: { width: 6 },

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

  tipoText: { fontSize: 16, fontWeight: '700' },
  fechaText: { fontSize: 13, color: '#374151', marginTop: 2 },
  horaText: { fontSize: 12, color: '#6B7280', marginTop: 1 },

  cantBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },

  cantText: { fontSize: 12, fontWeight: '700', color: '#004C97' },

  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  subText: { fontSize: 12, color: '#6B7280' },

  expandido: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  expandidoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004C97',
    marginBottom: 8,
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

  articuloNombre: { fontSize: 13, fontWeight: '600', color: '#111827' },
  articuloSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});