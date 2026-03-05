import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert, TouchableOpacity, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';
import api from '../../services/api';

export default function ArticulosFueraScreen() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
  try {
    const response = await api.get('/articulos-fuera');
    console.log('RESPUESTA:', response.data);
    setArticulos(response.data);
  } catch (error: any) {
    console.log('ERROR COMPLETO:', error);
    console.log('ERROR RESPONSE:', error?.response?.data);
    console.log('ERROR STATUS:', error?.response?.status);
    Alert.alert('Error', 'No se pudieron cargar los artículos');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticulos();
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
      <AppNav title="" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Artículos fuera</Text>
        <Text style={styles.headerSubtitle}>
          {articulos.length} artículo{articulos.length !== 1 ? 's' : ''} fuera del complejo
        </Text>
      </View>

      {articulos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#16A34A" />
          <Text style={styles.emptyTitle}>Todo en orden</Text>
          <Text style={styles.emptyText}>
            No hay artículos fuera del complejo en este momento
          </Text>
        </View>
      ) : (
        <FlatList
          data={articulos}
          keyExtractor={(item) => String(item.id_articulo)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004C97']} />
          }
          renderItem={({ item }) => {
            const isExpanded = expandido === item.id_articulo;
            const fecha = new Date(item.fecha_ultima_modificacion || item.fecha_registro);

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpandir(item.id_articulo)}
                activeOpacity={0.85}
              >
                {/* FRANJA LATERAL */}
                <View style={styles.franja} />

                <View style={{ flex: 1 }}>
                  {/* FILA PRINCIPAL */}
                  <View style={styles.cardHeader}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="cube-outline" size={22} color="#E74C3C" />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.nombreText}>{item.nombre_articulo}</Text>
                      <Text style={styles.marcaText}>
                        {item.marca} — {item.modelo}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <View style={styles.estadoBadge}>
                        <Text style={styles.estadoText}>Retirado</Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#9CA3AF"
                      />
                    </View>
                  </View>

                  {/* FECHA */}
                  <View style={styles.fechaRow}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.fechaText}>
                      Salió el {fecha.toLocaleDateString('es-CO', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </Text>
                  </View>

                  {/* EXPANDIDO */}
                  {isExpanded && (
                    <View style={styles.expandido}>
                      {[
                        { label: 'Número de serie', value: item.numero_serie },
                        { label: 'Color', value: item.color },
                        { label: 'Categoría', value: item.categoria?.nombre_categoria },
                        { label: 'Propietario', value: item.usuario ? `${item.usuario.nombres} ${item.usuario.apellidos}` : null },
                        { label: 'Observaciones', value: item.observaciones },
                      ].filter(f => f.value).map((field, i) => (
                        <View key={i} style={styles.fieldRow}>
                          <Text style={styles.fieldLabel}>{field.label}</Text>
                          <Text style={styles.fieldValue}>{field.value}</Text>
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
    gap: 12,
    padding: 32,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
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
    backgroundColor: '#E74C3C',
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
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nombreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  marcaText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  estadoBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },

  estadoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E74C3C',
  },

  fechaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  fechaText: {
    fontSize: 12,
    color: '#6B7280',
  },

  expandido: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fieldLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  fieldValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
});