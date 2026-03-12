import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert,
  Image, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppNav from '../../../components/ui/nav';
import api from "../../../services/api";

const getEstadoConfig = (estado: string) => {
  switch (estado) {
    case 'en_sede':    return { label: 'En sede',     color: '#16A34A', bg: '#D1FAE5' };
    case 'retirado':   return { label: 'Retirado',    color: '#D97706', bg: '#FEF3C7' };
    case 'registrado': return { label: 'Registrado',  color: '#004C97', bg: '#EFF6FF' };
    default:           return { label: estado,         color: '#6B7280', bg: '#F3F4F6' };
  }
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "—"}</Text>
  </View>
);

export default function DetalleArticuloScreen() {
  const { id } = useLocalSearchParams();
  const [articulo, setArticulo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticulo();
  }, []);

  const fetchArticulo = async () => {
    try {
      const response = await api.get(`/articulos/${id}`);
      setArticulo(response.data);
    } catch {
      Alert.alert("Error", "No se pudo cargar el artículo");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  const estadoConfig = getEstadoConfig(articulo?.estado_articulo);
  // Busca ruta_foto o url (compatibilidad)
  const fotoUrl = articulo?.fotos?.[0]?.ruta_foto ?? articulo?.fotos?.[0]?.url ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Detalle artículo" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* FOTO */}
        {fotoUrl ? (
          <View style={styles.fotoWrap}>
            <Image source={{ uri: fotoUrl }} style={styles.foto} />
            <View style={[styles.estadoAbsoluto, { backgroundColor: estadoConfig.bg }]}>
              <Text style={[styles.estadoText, { color: estadoConfig.color }]}>
                {estadoConfig.label}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Ionicons name="image-outline" size={48} color="#D1D5DB" />
            <Text style={styles.fotoPlaceholderText}>Sin foto registrada</Text>
            <View style={[styles.estadoBadge, { backgroundColor: estadoConfig.bg }]}>
              <Text style={[styles.estadoText, { color: estadoConfig.color }]}>
                {estadoConfig.label}
              </Text>
            </View>
          </View>
        )}

        {/* NOMBRE */}
        <Text style={styles.nombre}>{articulo?.nombre_articulo}</Text>
        <Text style={styles.categoria}>{articulo?.categoria?.nombre_categoria}</Text>

        {/* INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del artículo</Text>

          <InfoRow label="Descripción"    value={articulo?.descripcion} />
          <InfoRow label="Marca"          value={articulo?.marca} />
          <InfoRow label="Modelo"         value={articulo?.modelo} />
          <InfoRow label="Color"          value={articulo?.color} />
          <InfoRow label="N° Serie"       value={articulo?.numero_serie} />
          <InfoRow label="Observaciones"  value={articulo?.observaciones} />
          <InfoRow
            label="Fecha de registro"
            value={new Date(articulo?.fecha_registro).toLocaleDateString('es-CO', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          />
        </View>

        {/* ACCIONES */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push({ pathname: '/stackInterno/editarArticulo', params: { id } })}
          >
            <Ionicons name="pencil-outline" size={18} color="#fff" />
            <Text style={styles.editBtnText}>Editar artículo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },

  fotoWrap: {
    width: '100%', height: 240,
    position: 'relative',
  },
  foto: {
    width: '100%', height: '100%',
    resizeMode: 'cover',
  },
  estadoAbsoluto: {
    position: 'absolute', top: 16, right: 16,
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 99,
  },

  fotoPlaceholder: {
    height: 160,
    backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  fotoPlaceholderText: { fontSize: 13, color: '#9CA3AF' },

  estadoBadge: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
  },
  estadoText: { fontSize: 12, fontWeight: '700' },

  nombre: {
    fontSize: 22, fontWeight: '800', color: '#111827',
    paddingHorizontal: 20, marginTop: 20, textAlign: 'center',
  },
  categoria: {
    fontSize: 14, color: '#6B7280', fontWeight: '600',
    textAlign: 'center', marginTop: 4, marginBottom: 16,
  },

  card: {
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 20, padding: 20,
    elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15, fontWeight: '700', color: '#004C97', marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#111827', fontWeight: '600', textAlign: 'right', flexShrink: 1, maxWidth: '60%' },

  actions: { paddingHorizontal: 16, gap: 12 },

  editBtn: {
    backgroundColor: '#004C97', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 14,
  },
  editBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  backBtn: {
    backgroundColor: '#F3F4F6', paddingVertical: 14,
    borderRadius: 14, alignItems: 'center',
  },
  backBtnText: { color: '#374151', fontSize: 15, fontWeight: '600' },
});