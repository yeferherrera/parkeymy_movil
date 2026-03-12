import CustomInput from '@/components/input/customInput';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Objeto {
  nombre: string;
  descripcion: string;
}

const DURACIONES = [
  { label: '1 hora',  value: 1 },
  { label: '2 horas', value: 2 },
  { label: '4 horas', value: 4 },
  { label: '8 horas', value: 8 },
];

export default function RegistrarVisitanteScreen() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  // Datos personales
  const [tipoDoc, setTipoDoc] = useState('CC');
  const [numDoc, setNumDoc] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [motivo, setMotivo] = useState('');
  const [personaVisitar, setPersonaVisitar] = useState('');
  const [duracion, setDuracion] = useState(1);

  // Objetos
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');

  const agregarObjeto = () => {
    if (!nuevoNombre.trim()) {
      Alert.alert('Error', 'El nombre del objeto es obligatorio');
      return;
    }
    setObjetos(prev => [...prev, { nombre: nuevoNombre.trim(), descripcion: nuevaDesc.trim() }]);
    setNuevoNombre('');
    setNuevaDesc('');
  };

  const eliminarObjeto = (index: number) => {
    setObjetos(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegistrar = async () => {
    if (!numDoc.trim() || !nombres.trim() || !apellidos.trim() || !motivo.trim()) {
      Alert.alert('Error', 'Documento, nombres, apellidos y motivo son obligatorios');
      return;
    }

    try {
      setEnviando(true);
      await api.post('/visitantes', {
        tipo_documento:  tipoDoc,
        numero_documento: numDoc,
        nombres, apellidos, telefono, empresa,
        motivo_visita: motivo,
        persona_visitar: personaVisitar,
        duracion_horas: duracion,
        objetos: objetos.length > 0 ? objetos : undefined,
      });

      Alert.alert(
        '✅ Visitante registrado',
        `${nombres} tiene acceso por ${duracion} hora${duracion !== 1 ? 's' : ''}.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo registrar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar visitante</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* DATOS PERSONALES */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Datos personales</Text>

          {/* Tipo documento */}
          <Text style={styles.inputLabel}>Tipo de documento</Text>
          <View style={styles.tiposDoc}>
            {['CC', 'TI', 'CE', 'PA'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tipoDocBtn, tipoDoc === t && styles.tipoDocActivo]}
                onPress={() => setTipoDoc(t)}
              >
                <Text style={[styles.tipoDocText, tipoDoc === t && styles.tipoDocTextActivo]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput label="Número de documento" placeholder="Ej: 1234567890" value={numDoc} onChangeText={setNumDoc} />
          <CustomInput label="Nombres" placeholder="Ej: Juan Carlos" value={nombres} onChangeText={setNombres} />
          <CustomInput label="Apellidos" placeholder="Ej: González Pérez" value={apellidos} onChangeText={setApellidos} />
          <CustomInput label="Teléfono (opcional)" placeholder="Ej: 3001234567" value={telefono} onChangeText={setTelefono} />
          <CustomInput label="Empresa (opcional)" placeholder="Ej: Empresa XYZ" value={empresa} onChangeText={setEmpresa} />
          <CustomInput label="Motivo de visita" placeholder="Ej: Reunión con instructor" value={motivo} onChangeText={setMotivo} />
          <CustomInput label="Persona a visitar (opcional)" placeholder="Ej: Carlos Martínez" value={personaVisitar} onChangeText={setPersonaVisitar} />
        </View>

        {/* DURACIÓN */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Tiempo de permanencia</Text>
          <View style={styles.duracionGrid}>
            {DURACIONES.map(d => (
              <TouchableOpacity
                key={d.value}
                style={[styles.duracionBtn, duracion === d.value && styles.duracionActivo]}
                onPress={() => setDuracion(d.value)}
              >
                <Text style={[styles.duracionText, duracion === d.value && styles.duracionTextActivo]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.expiracionInfo}>
            Expira a las {new Date(Date.now() + duracion * 3600000).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* OBJETOS */}
        <View style={styles.card}>
          <Text style={styles.seccionLabel}>Objetos que ingresa</Text>
          <Text style={styles.seccionSub}>Opcional — registra artículos, equipos o elementos</Text>

          {objetos.map((obj, i) => (
            <View key={i} style={styles.objetoItem}>
              <View style={styles.objetoIcon}>
                <Ionicons name="cube-outline" size={18} color="#004C97" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.objetoNombre}>{obj.nombre}</Text>
                {obj.descripcion ? (
                  <Text style={styles.objetoDesc}>{obj.descripcion}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => eliminarObjeto(i)}>
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.nuevoObjeto}>
            <TextInput
              style={styles.objetoInput}
              placeholder="Nombre del objeto"
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
            <TouchableOpacity style={styles.agregarBtn} onPress={agregarObjeto}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.agregarText}>Agregar objeto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÓN REGISTRAR */}
        <TouchableOpacity
          style={[styles.registrarBtn, enviando && { opacity: 0.7 }]}
          onPress={handleRegistrar}
          disabled={enviando}
        >
          {enviando
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="person-add-outline" size={20} color="#fff" />
                <Text style={styles.registrarText}>Registrar visitante</Text>
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

  card: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 20, marginBottom: 20,
    elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  seccionLabel: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  seccionSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },

  tiposDoc: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tipoDocBtn: {
    flex: 1, paddingVertical: 10,
    borderRadius: 12, backgroundColor: '#F3F4F6',
    alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent',
  },
  tipoDocActivo: { backgroundColor: '#EFF6FF', borderColor: '#004C97' },
  tipoDocText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tipoDocTextActivo: { color: '#004C97' },

  duracionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  duracionBtn: {
    paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 12, backgroundColor: '#F3F4F6',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  duracionActivo: { backgroundColor: '#EFF6FF', borderColor: '#1E3A5F' },
  duracionText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  duracionTextActivo: { color: '#1E3A5F' },
  expiracionInfo: { fontSize: 13, color: '#16A34A', fontWeight: '600', textAlign: 'center' },

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

  nuevoObjeto: { gap: 8, marginTop: 8 },
  objetoInput: {
    backgroundColor: '#F8FAFC', borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#111827',
  },

  agregarBtn: {
    backgroundColor: '#004C97', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12,
  },
  agregarText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  registrarBtn: {
    backgroundColor: '#1E3A5F', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 16,
  },
  registrarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});