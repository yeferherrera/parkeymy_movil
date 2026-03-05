import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';
import CustomInput from '@/components/input/customInput';
import { useRouter } from 'expo-router';
import api from '@/app/services/api';

const TIPOS = [
  { value: 'daño_articulo',    label: 'Daño en artículo',    icon: 'construct-outline',   color: '#D97706', bg: '#FEF3C7' },
  { value: 'perdida_articulo', label: 'Pérdida de artículo', icon: 'alert-circle-outline', color: '#E74C3C', bg: '#FEE2E2' },
  { value: 'incidente_sede',   label: 'Incidente en sede',   icon: 'warning-outline',      color: '#7C3AED', bg: '#F5F3FF' },
];

export default function NuevoReporteScreen() {
  const router = useRouter();
  const [tipo, setTipo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!tipo) {
      Alert.alert('Error', 'Selecciona el tipo de reporte');
      return;
    }
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    try {
      setEnviando(true);
      await api.post('/reportes', {
        tipo_reporte: tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      });

      Alert.alert(
        '✅ Reporte enviado',
        'Tu reporte fue registrado correctamente. Te notificaremos cuando reciba una respuesta.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo enviar el reporte');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppNav title="Nuevo reporte" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuevo reporte</Text>
        <Text style={styles.headerSub}>Describe el problema detalladamente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* TIPO DE REPORTE */}
        <Text style={styles.seccionLabel}>Tipo de reporte</Text>
        <View style={styles.tiposGrid}>
          {TIPOS.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.tipoCard,
                tipo === t.value && { borderColor: t.color, borderWidth: 2 }
              ]}
              onPress={() => setTipo(t.value)}
              activeOpacity={0.8}
            >
              <View style={[styles.tipoIcon, { backgroundColor: tipo === t.value ? t.bg : '#F8FAFC' }]}>
                <Ionicons name={t.icon as any} size={24} color={tipo === t.value ? t.color : '#9CA3AF'} />
              </View>
              <Text style={[
                styles.tipoLabel,
                tipo === t.value && { color: t.color, fontWeight: '700' }
              ]}>
                {t.label}
              </Text>
              {tipo === t.value && (
                <View style={[styles.tipoCheck, { backgroundColor: t.color }]}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* FORMULARIO */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Información del reporte</Text>

          <CustomInput
            label="Título"
            placeholder="Ej: Daño en mi portátil"
            value={titulo}
            onChangeText={setTitulo}
          />

          <CustomInput
            label="Descripción detallada"
            placeholder="Describe qué ocurrió, cuándo y dónde..."
            value={descripcion}
            onChangeText={setDescripcion}
            
          />

          {/* Fecha automática */}
          <View style={styles.fechaBox}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.fechaLabel}>Fecha de registro:</Text>
            <Text style={styles.fechaValue}>
              {new Date().toLocaleDateString('es-CO', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          style={[styles.btn, (!tipo || enviando) && { opacity: 0.6 }]}
          onPress={handleEnviar}
          disabled={!tipo || enviando}
          activeOpacity={0.85}
        >
          {enviando
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="send-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>Enviar reporte</Text>
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

  content: { padding: 20, paddingBottom: 40 },

  seccionLabel: {
    fontSize: 15, fontWeight: '700',
    color: '#374151', marginBottom: 12,
  },

  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  tipoCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },

  tipoIcon: {
    width: 48, height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipoLabel: {
    fontSize: 11, fontWeight: '600',
    color: '#6B7280', textAlign: 'center',
  },

  tipoCheck: {
    position: 'absolute',
    top: 8, right: 8,
    width: 20, height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  fechaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fechaLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  fechaValue: { fontSize: 13, color: '#111827', fontWeight: '700' },

  btn: {
    backgroundColor: '#004C97',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});