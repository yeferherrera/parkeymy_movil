import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';
import api from '../../services/api';
import { SvgUri } from 'react-native-svg';

type Modo = 'ingreso' | 'salida';

export default function GenerarQRScreen() {
  const [modo, setModo] = useState<Modo>('ingreso');
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [tipoQrGenerado, setTipoQrGenerado] = useState<Modo>('ingreso');

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/mis-articulos');
      setArticulos(response.data.map((a: any) => ({ ...a, selected: false })));
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  // Filtra según el modo activo
  const articulosFiltrados = articulos.filter(a =>
    modo === 'ingreso'
      ? ['registrado', 'retirado'].includes(a.estado_articulo)
      : a.estado_articulo === 'en_sede'
  ).map(a => ({ ...a }));

  // Mantener selección por ID
  const [seleccionIds, setSeleccionIds] = useState<number[]>([]);

  const toggleArticulo = (id: number) => {
    setSeleccionIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const cambiarModo = (nuevoModo: Modo) => {
    setModo(nuevoModo);
    setSeleccionIds([]);
    setQrUrl(null);
  };

  const generarQR = async () => {
    if (seleccionIds.length === 0) return;

    setGenerando(true);
    setQrUrl(null);
    try {
      const response = await api.post('/generar-qr', {
        articulos: seleccionIds,
        tipo_movimiento: modo,
      });

      setTipoQrGenerado(modo);
      setQrUrl(response.data.qr_url);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'No se pudo generar el QR';
      Alert.alert('Error', msg);
    } finally {
      setGenerando(false);
    }
  };

  const resetear = () => {
    setQrUrl(null);
    setSeleccionIds([]);
    fetchArticulos();
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
        <Text style={styles.headerTitle}>Generar código QR</Text>
        <Text style={styles.headerSubtitle}>
          {modo === 'ingreso'
            ? 'Selecciona los artículos que vas a ingresar'
            : 'Selecciona los artículos que vas a retirar'}
        </Text>

        {/* SELECTOR INGRESO / SALIDA */}
        {!qrUrl && (
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, modo === 'ingreso' && styles.toggleActive]}
              onPress={() => cambiarModo('ingreso')}
            >
              <Ionicons name="enter-outline" size={16} color={modo === 'ingreso' ? '#fff' : '#93C5FD'} />
              <Text style={[styles.toggleText, modo === 'ingreso' && styles.toggleTextActive]}>
                Ingreso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, modo === 'salida' && styles.toggleActiveSalida]}
              onPress={() => cambiarModo('salida')}
            >
              <Ionicons name="exit-outline" size={16} color={modo === 'salida' ? '#fff' : '#93C5FD'} />
              <Text style={[styles.toggleText, modo === 'salida' && styles.toggleTextActive]}>
                Salida
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* QR GENERADO */}
      {qrUrl && (
        <View style={styles.qrContainer}>
          <View style={[styles.qrBadge, tipoQrGenerado === 'ingreso' ? styles.qrBadgeIngreso : styles.qrBadgeSalida]}>
            <Text style={styles.qrBadgeText}>
              {tipoQrGenerado === 'ingreso' ? '↓ QR de Ingreso' : '↑ QR de Salida'}
            </Text>
          </View>
          <Text style={styles.qrLabel}>¡QR generado! Muéstraselo al vigilante</Text>
          <SvgUri width={260} height={260} uri={qrUrl} />
          <Text style={styles.qrExpira}>⏱ Expira en 2 horas</Text>
        </View>
      )}

      {/* LISTA DE ARTÍCULOS */}
      {!qrUrl && (
        <>
          {articulosFiltrados.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <FontAwesome5 name="box-open" size={40} color="#D1D5DB" />
              <Text style={{ color: '#888', fontSize: 15, marginTop: 16, textAlign: 'center' }}>
                {modo === 'ingreso'
                  ? 'No tienes artículos disponibles para ingresar'
                  : 'No tienes artículos dentro del complejo para retirar'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={articulosFiltrados}
              keyExtractor={(item) => String(item.id_articulo)}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => {
                const isSelected = seleccionIds.includes(item.id_articulo);
                return (
                  <TouchableOpacity
                    style={[styles.card, isSelected && (modo === 'ingreso' ? styles.cardSelected : styles.cardSelectedSalida)]}
                    onPress={() => toggleArticulo(item.id_articulo)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardText}>{item.nombre_articulo}</Text>
                      <Text style={styles.cardSub}>{item.marca} — {item.modelo}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={modo === 'ingreso' ? '#16A34A' : '#E74C3C'}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.counter}>
              Artículos seleccionados: {seleccionIds.length}
            </Text>

            <TouchableOpacity
              style={[
                styles.qrButton,
                modo === 'salida' && styles.qrButtonSalida,
                (seleccionIds.length === 0 || generando) && styles.qrDisabled
              ]}
              disabled={seleccionIds.length === 0 || generando}
              onPress={generarQR}
            >
              {generando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome5 name="qrcode" size={24} color="#fff" />
                  <Text style={styles.qrText}>
                    {modo === 'ingreso' ? 'Generar QR de ingreso' : 'Generar QR de salida'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* BOTÓN GENERAR OTRO */}
      {qrUrl && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.qrButton} onPress={resetear}>
            <Text style={styles.qrText}>Generar otro QR</Text>
          </TouchableOpacity>
        </View>
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
  },

  headerTitle: { textAlign: 'center', color: '#fff', fontSize: 22 },
  headerSubtitle: { textAlign: 'center', color: '#E0E7FF', marginTop: 6, fontSize: 14 },

  toggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    marginTop: 16,
    padding: 4,
    gap: 4,
  },

  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },

  toggleActive: { backgroundColor: '#16A34A' },
  toggleActiveSalida: { backgroundColor: '#E74C3C' },

  toggleText: { color: '#93C5FD', fontWeight: '600', fontSize: 14 },
  toggleTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },

  cardSelected: { borderWidth: 1.5, borderColor: '#16A34A' },
  cardSelectedSalida: { borderWidth: 1.5, borderColor: '#E74C3C' },
  cardText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  cardSub: { fontSize: 13, color: '#888', marginTop: 3 },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },

  counter: { fontSize: 14, color: '#374151', marginBottom: 12 },

  qrButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 50,
  },

  qrButtonSalida: { backgroundColor: '#E74C3C' },
  qrDisabled: { backgroundColor: '#9CA3AF' },
  qrText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  qrBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
    marginBottom: 14,
  },

  qrBadgeIngreso: { backgroundColor: '#D1FAE5' },
  qrBadgeSalida: { backgroundColor: '#FEE2E2' },

  qrBadgeText: { fontWeight: '700', fontSize: 14, color: '#111' },

  qrLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004C97',
    textAlign: 'center',
    marginBottom: 20,
  },

  qrExpira: {
    marginTop: 14,
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '600',
  },
});