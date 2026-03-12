import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Totales {
  total_ingresos: number;
  total_salidas: number;
  total_articulos_registrados: number;
  total_vehiculos_registrados: number;
  incidentes_reportados: number;
}

export default function NuevoReporteVigilanteScreen() {
  const router = useRouter();

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [totales, setTotales] = useState<Totales | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleCalcular = async () => {
    if (!fechaInicio || !fechaFin) {
      Alert.alert('Error', 'Ingresa las fechas de inicio y fin del turno');
      return;
    }
    try {
      setCalculando(true);
      const res = await api.post('/reportes-vigilancia/calcular', {
        fecha_hora_inicio: fechaInicio,
        fecha_hora_fin: fechaFin,
      });
      setTotales(res.data);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo calcular');
    } finally {
      setCalculando(false);
    }
  };

  const handleEnviar = async () => {
    if (!totales) {
      Alert.alert('Error', 'Primero calcula los totales del turno');
      return;
    }
    try {
      setEnviando(true);
      await api.post('/reportes-vigilancia', {
        fecha_hora_inicio:           fechaInicio,
        fecha_hora_fin:              fechaFin,
        total_ingresos:              totales.total_ingresos,
        total_salidas:               totales.total_salidas,
        total_articulos_registrados: totales.total_articulos_registrados,
        total_vehiculos_registrados: totales.total_vehiculos_registrados,
        incidentes_reportados:       totales.incidentes_reportados,
        observaciones:               observaciones || null,
      });
      Alert.alert(
        '✅ Reporte enviado',
        'El reporte de turno fue registrado correctamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo enviar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo reporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* FECHAS */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Horario del turno</Text>

          <Text style={styles.inputLabel}>Inicio del turno</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD HH:MM:SS"
            placeholderTextColor="#9CA3AF"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />

          <Text style={styles.inputLabel}>Fin del turno</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD HH:MM:SS"
            placeholderTextColor="#9CA3AF"
            value={fechaFin}
            onChangeText={setFechaFin}
          />

          <TouchableOpacity
            style={[styles.calcularBtn, calculando && { opacity: 0.7 }]}
            onPress={handleCalcular}
            disabled={calculando}
          >
            {calculando
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Ionicons name="calculator-outline" size={18} color="#fff" />
                  <Text style={styles.calcularText}>Calcular totales automáticamente</Text>
                </>
            }
          </TouchableOpacity>
        </View>

        {/* TOTALES */}
        {totales && (
          <View style={styles.card}>
            <Text style={styles.seccionLabel}>Totales del turno</Text>
            <Text style={styles.seccionSub}>Puedes editar los valores si es necesario</Text>

            {[
              { key: 'total_ingresos',              label: 'Ingresos',    icon: 'log-in-outline',    color: '#16A34A' },
              { key: 'total_salidas',               label: 'Salidas',     icon: 'log-out-outline',   color: '#E74C3C' },
              { key: 'total_articulos_registrados', label: 'Artículos',   icon: 'cube-outline',      color: '#004C97' },
            ].map(item => (
              <View key={item.key} style={styles.totalRow}>
                <View style={[styles.totalIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={styles.totalLabel}>{item.label}</Text>
                <View style={styles.totalInputWrap}>
                  <TouchableOpacity
                    onPress={() => setTotales(prev => prev ? { ...prev, [item.key]: Math.max(0, prev[item.key as keyof Totales] - 1) } : prev)}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                  <Text style={styles.totalNum}>
                    {totales[item.key as keyof Totales]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTotales(prev => prev ? { ...prev, [item.key]: prev[item.key as keyof Totales] + 1 } : prev)}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#16A34A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* OBSERVACIONES */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Observaciones</Text>
          <Text style={styles.seccionSub}>Opcional — agrega notas adicionales del turno</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Sin novedades, turno tranquilo..."
            placeholderTextColor="#9CA3AF"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* BOTÓN ENVIAR */}
        <TouchableOpacity
          style={[styles.enviarBtn, (!totales || enviando) && { opacity: 0.6 }]}
          onPress={handleEnviar}
          disabled={!totales || enviando}
        >
          {enviando
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="send-outline" size={20} color="#fff" />
                <Text style={styles.enviarText}>Enviar reporte</Text>
              </>
          }
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },

  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  content: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  seccionLabel: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  seccionSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 16 },

  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },

  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },

  textArea: { height: 100, paddingTop: 12 },

  calcularBtn: {
    backgroundColor: '#1E3A5F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  calcularText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  totalIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  totalInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalNum: { fontSize: 18, fontWeight: '800', color: '#111827', minWidth: 30, textAlign: 'center' },

  enviarBtn: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  enviarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});