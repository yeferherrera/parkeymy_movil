import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Objeto {
  id_objeto: number;
  nombre: string;
  descripcion: string | null;
}

interface Registro {
  id_registro_visitante: number;
  fecha_hora_ingreso: string;
  fecha_hora_salida: string | null;
  estado_visita: string;
  observaciones_ingreso: string | null;
}

interface Visitante {
  id_visitante: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string | null;
  empresa: string | null;
  motivo_visita: string;
  persona_visitar: string | null;
  estado: string;
  fecha_expiracion: string | null;
}

export default function DetalleVisitanteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [visitante, setVisitante] = useState<Visitante | null>(null);
  const [registro, setRegistro] = useState<Registro | null>(null);
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [loading, setLoading] = useState(true);

  const [agregando, setAgregando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [registrandoSalida, setRegistrandoSalida] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDetalle();
    }, [])
  );

  const fetchDetalle = async () => {
    try {
      const res = await api.get(`/visitantes/${id}`);
      setVisitante(res.data.visitante);
      setRegistro(res.data.registro);
      setObjetos(res.data.objetos ?? []);
    } catch {
      if (Platform.OS === 'web') {
        window.alert('No se pudo cargar el visitante');
      } else {
        Alert.alert('Error', 'No se pudo cargar el visitante');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarObjeto = async () => {
    if (!nuevoNombre.trim()) {
      if (Platform.OS === 'web') {
        window.alert('El nombre del objeto es obligatorio');
      } else {
        Alert.alert('Error', 'El nombre del objeto es obligatorio');
      }
      return;
    }
    try {
      setGuardando(true);
      const res = await api.post(`/visitantes/${id}/objetos`, {
        objetos: [{ nombre: nuevoNombre.trim(), descripcion: nuevaDesc.trim() || null }]
      });
      setObjetos(res.data.objetos);
      setNuevoNombre('');
      setNuevaDesc('');
      setAgregando(false);
    } catch {
      if (Platform.OS === 'web') {
        window.alert('No se pudo agregar el objeto');
      } else {
        Alert.alert('Error', 'No se pudo agregar el objeto');
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleRegistrarSalida = () => {
    if (Platform.OS === 'web') {
      // En web, Alert.alert no funciona — usamos window.confirm
      const confirmado = window.confirm(
        `¿Confirmas la salida de ${visitante?.nombres}?`
      );
      if (!confirmado) return;

      setRegistrandoSalida(true);
      api.post(`/visitantes/${id}/salida`)
        .then(() => {
          window.alert('✅ Salida registrada correctamente.');
          router.back();
        })
        .catch((e: any) => {
          window.alert(e?.response?.data?.message ?? 'No se pudo registrar la salida');
        })
        .finally(() => {
          setRegistrandoSalida(false);
        });
    } else {
      Alert.alert(
        'Registrar salida',
        `¿Confirmas la salida de ${visitante?.nombres}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar salida',
            style: 'destructive',
            onPress: async () => {
              try {
                setRegistrandoSalida(true);
                await api.post(`/visitantes/${id}/salida`);
                Alert.alert(
                  '✅ Salida registrada',
                  'La salida del visitante fue registrada correctamente.',
                  [{ text: 'OK', onPress: () => router.back() }]
                );
              } catch (e: any) {
                Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo registrar la salida');
              } finally {
                setRegistrandoSalida(false);
              }
            }
          }
        ]
      );
    }
  };

  const formatFecha = (fecha: string) => new Date(fecha).toLocaleString('es-CO', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit'
  });

  const tiempoRestante = (fecha: string) => {
    const diff = new Date(fecha).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expirado';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min restantes`;
    return `${Math.floor(mins / 60)}h ${mins % 60}min restantes`;
  };

  const estadoConfig: Record<string, { color: string; bg: string }> = {
    activo:   { color: '#16A34A', bg: '#D1FAE5' },
    expirado: { color: '#D97706', bg: '#FEF3C7' },
    inactivo: { color: '#6B7280', bg: '#F3F4F6' },
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  if (!visitante) return null;

  const estado = estadoConfig[visitante.estado] ?? estadoConfig.inactivo;

  const puedeRegistrarSalida =
    visitante.estado === 'activo' || visitante.estado === 'expirado';

  const puedeAgregarObjetos = registro?.estado_visita === 'activo';

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle visitante</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* TARJETA PRINCIPAL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {visitante.nombres.charAt(0)}{visitante.apellidos.charAt(0)}
            </Text>
          </View>

          <Text style={styles.profileNombre}>
            {visitante.nombres} {visitante.apellidos}
          </Text>

          <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
            <Text style={[styles.estadoText, { color: estado.color }]}>
              {visitante.estado.charAt(0).toUpperCase() + visitante.estado.slice(1)}
            </Text>
          </View>

          {visitante.estado === 'activo' && visitante.fecha_expiracion && (
            <View style={styles.tiempoWrap}>
              <Ionicons name="time-outline" size={14} color="#D97706" />
              <Text style={styles.tiempoText}>
                {tiempoRestante(visitante.fecha_expiracion)}
              </Text>
            </View>
          )}

          {visitante.estado === 'expirado' && (
            <View style={styles.expiradoWrap}>
              <Ionicons name="warning-outline" size={14} color="#D97706" />
              <Text style={styles.expiradoText}>
                Tiempo de visita vencido — registra la salida
              </Text>
            </View>
          )}
        </View>

        {/* INFORMACIÓN */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Información personal</Text>

          {[
            { label: 'Documento', value: `${visitante.tipo_documento} ${visitante.numero_documento}` },
            { label: 'Teléfono', value: visitante.telefono ?? '—' },
            { label: 'Empresa', value: visitante.empresa ?? '—' },
            { label: 'Motivo', value: visitante.motivo_visita },
            { label: 'Visita a', value: visitante.persona_visitar ?? '—' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoRow, i === 4 && { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* REGISTRO DE VISITA */}
        {registro && (
          <View style={styles.card}>
            <Text style={styles.seccionLabel}>Registro de visita</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ingreso</Text>
              <Text style={styles.infoValue}>{formatFecha(registro.fecha_hora_ingreso)}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Salida</Text>
              <Text style={styles.infoValue}>
                {registro.fecha_hora_salida
                  ? formatFecha(registro.fecha_hora_salida)
                  : 'Aún dentro'}
              </Text>
            </View>
          </View>
        )}

        {/* OBJETOS */}
        <View style={styles.card}>
          <View style={styles.objetosHeader}>
            <Text style={styles.seccionLabel}>
              Objetos ({objetos.length})
            </Text>
            {puedeAgregarObjetos && (
              <TouchableOpacity
                style={styles.agregarIconBtn}
                onPress={() => setAgregando(!agregando)}
              >
                <Ionicons name={agregando ? 'close' : 'add'} size={20} color="#004C97" />
                <Text style={styles.agregarIconText}>
                  {agregando ? 'Cancelar' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {objetos.length === 0 && !agregando && (
            <View style={styles.sinObjetos}>
              <Ionicons name="cube-outline" size={32} color="#D1D5DB" />
              <Text style={styles.sinObjetosText}>Sin objetos registrados</Text>
            </View>
          )}

          {objetos.map((obj) => (
            <View key={obj.id_objeto} style={styles.objetoItem}>
              <View style={styles.objetoIcon}>
                <Ionicons name="cube-outline" size={18} color="#004C97" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.objetoNombre}>{obj.nombre}</Text>
                {obj.descripcion && (
                  <Text style={styles.objetoDesc}>{obj.descripcion}</Text>
                )}
              </View>
            </View>
          ))}

          {agregando && (
            <View style={styles.nuevoObjetoForm}>
              <TextInput
                style={styles.objetoInput}
                placeholder="Nombre del objeto *"
                placeholderTextColor="#9CA3AF"
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
              />
              <TextInput
                style={styles.objetoInput}
                placeholder="Descripción (opcional)"
                placeholderTextColor="#9CA3AF"
                value={nuevaDesc}
                onChangeText={setNuevaDesc}
              />
              <TouchableOpacity
                style={[styles.guardarObjetoBtn, guardando && { opacity: 0.7 }]}
                onPress={handleAgregarObjeto}
                disabled={guardando}
              >
                {guardando
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      <Text style={styles.guardarObjetoText}>Guardar objeto</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* BOTÓN SALIDA — activo O expirado */}
        {puedeRegistrarSalida && (
          <TouchableOpacity
            style={[
              styles.salidaBtn,
              visitante.estado === 'expirado' && styles.salidaBtnExpirado,
              registrandoSalida && { opacity: 0.7 }
            ]}
            onPress={handleRegistrarSalida}
            disabled={registrandoSalida}
          >
            {registrandoSalida
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="exit-outline" size={20} color="#fff" />
                  <Text style={styles.salidaText}>
                    {visitante.estado === 'expirado'
                      ? 'Registrar salida (expirado)'
                      : 'Registrar salida'}
                  </Text>
                </>
            }
          </TouchableOpacity>
        )}

      </ScrollView>
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
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  content: { padding: 20, paddingBottom: 40 },

  profileCard: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 24, alignItems: 'center',
    marginBottom: 16, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.07,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    gap: 8,
  },
  avatarWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#004C97',
    marginBottom: 4,
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#004C97' },
  profileNombre: { fontSize: 20, fontWeight: '800', color: '#111827' },
  estadoBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 99 },
  estadoText: { fontSize: 13, fontWeight: '700' },
  tiempoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tiempoText: { fontSize: 13, color: '#D97706', fontWeight: '600' },

  expiradoWrap: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, backgroundColor: '#FEF3C7',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 99,
  },
  expiradoText: { fontSize: 12, color: '#D97706', fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 20, marginBottom: 16,
    elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  seccionLabel: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 14 },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  infoValue: {
    fontSize: 13, color: '#111827',
    fontWeight: '600', textAlign: 'right',
    flexShrink: 1, maxWidth: '60%',
  },

  objetosHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  agregarIconBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, backgroundColor: '#EFF6FF',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 99,
  },
  agregarIconText: { fontSize: 13, fontWeight: '700', color: '#004C97' },

  sinObjetos: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  sinObjetosText: { fontSize: 13, color: '#9CA3AF' },

  objetoItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 12, backgroundColor: '#F8FAFC',
    borderRadius: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  objetoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
  },
  objetoNombre: { fontSize: 14, fontWeight: '600', color: '#111827' },
  objetoDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  nuevoObjetoForm: { gap: 8, marginTop: 8 },
  objetoInput: {
    backgroundColor: '#F8FAFC', borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#111827',
  },
  guardarObjetoBtn: {
    backgroundColor: '#004C97', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12,
  },
  guardarObjetoText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  salidaBtn: {
    backgroundColor: '#E74C3C', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 16,
  },
  salidaBtnExpirado: {
    backgroundColor: '#D97706',
  },
  salidaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});