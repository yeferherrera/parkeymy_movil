import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, Alert, Image
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';
import api from '../../services/api';
import { SvgUri } from 'react-native-svg';

export default function GenerarQRScreen() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const response = await api.get('/mis-articulos');
      // Solo articulos que pueden ingresar (registrado o retirado)
      const aptos = response.data
        .filter((a: any) => ['registrado', 'retirado'].includes(a.estado_articulo))
        .map((a: any) => ({ ...a, selected: false }));
      setArticulos(aptos);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const toggleArticulo = (id: number) => {
    setArticulos(prev =>
      prev.map(item =>
        item.id_articulo === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const seleccionados = articulos.filter(a => a.selected);

  const generarQR = async () => {
    if (seleccionados.length === 0) return;

    setGenerando(true);
    setQrUrl(null);
    try {
      const response = await api.post('/generar-qr', {
        articulos: seleccionados.map(a => a.id_articulo),
        tipo_movimiento: 'ingreso',
      });

      setQrUrl(response.data.qr_url);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'No se pudo generar el QR';
      Alert.alert('Error', msg);
    } finally {
      setGenerando(false);
    }
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generar código QR</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona los artículos que vas a ingresar
        </Text>
      </View>

      {/* QR generado */}
      {qrUrl && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>¡QR generado! Muéstraselo al vigilante</Text>
          <SvgUri
            width={260}
            height={260}
            uri={qrUrl}
          />
          <Text style={styles.qrExpira}>Expira en 2 horas</Text>
        </View>
      )}

      {/* Lista de artículos */}
      {!qrUrl && (
        <>
          {articulos.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 15 }}>
                No tienes artículos disponibles para ingresar
              </Text>
            </View>
          ) : (
            <FlatList
              data={articulos}
              keyExtractor={(item) => String(item.id_articulo)}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.card, item.selected && styles.cardSelected]}
                  onPress={() => toggleArticulo(item.id_articulo)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardText}>{item.nombre_articulo}</Text>
                    <Text style={styles.cardSub}>
                      {item.marca} — {item.modelo}
                    </Text>
                  </View>
                  {item.selected && (
                    <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.counter}>
              Artículos seleccionados: {seleccionados.length}
            </Text>

            <TouchableOpacity
              style={[styles.qrButton, (seleccionados.length === 0 || generando) && styles.qrDisabled]}
              disabled={seleccionados.length === 0 || generando}
              onPress={generarQR}
            >
              {generando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome5 name="qrcode" size={24} color="#fff" />
                  <Text style={styles.qrText}>Generar QR de ingreso</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Botón para generar otro QR */}
      {qrUrl && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => {
              setQrUrl(null);
              setArticulos(prev => prev.map(a => ({ ...a, selected: false })));
            }}
          >
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerTitle: { textAlign: "center", color: '#fff', fontSize: 22 },
  headerSubtitle: { textAlign: "center", color: '#E0E7FF', marginTop: 10, fontSize: 14 },

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

  qrDisabled: { backgroundColor: '#9CA3AF' },
  qrText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  qrLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004C97',
    textAlign: 'center',
    marginBottom: 20,
  },

  qrImage: {
    width: 260,
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D0D4D9',
  },

  qrExpira: {
    marginTop: 14,
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '600',
  },
});