import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator, Alert, Platform,
  Dimensions,
  Image, ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppNav from "../../../../components/ui/nav";
import api from "../../../../services/api";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.34;

export default function PerfilAprendizScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchPerfil();
    }, [])
  );

  const fetchPerfil = async () => {
    try {
      const response = await api.get('/perfil');
      setUsuario(response.data.usuario);
    } catch {
      if (Platform.OS === 'web') {
        window.alert('No se pudo cargar el perfil');
      } else {
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRolColor = (nombreRol: string) => {
    switch (nombreRol?.toLowerCase()) {
      case 'instructor': return '#7C3AED';
      case 'aprendiz':   return '#16A34A';
      case 'vigilante':  return '#D97706';
      default:           return '#004C97';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  const nombreRol = usuario?.rol?.nombre_rol ?? '';
  const rolColor  = getRolColor(nombreRol);

  return (
    <View style={styles.screen}>
      <AppNav title="Perfil" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* TARJETA PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              style={[styles.avatar, { borderColor: rolColor }]}
            />
            <TouchableOpacity style={[styles.editAvatar, { backgroundColor: rolColor }]}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{usuario?.nombres} {usuario?.apellidos}</Text>

          {/* Badge de rol dinámico */}
          <View style={[styles.rolBadge, { backgroundColor: rolColor + '20' }]}>
            <Ionicons
              name={nombreRol.toLowerCase() === 'instructor' ? 'school-outline' : 'person-outline'}
              size={14}
              color={rolColor}
            />
            <Text style={[styles.rolText, { color: rolColor }]}>
              {nombreRol} — SENA
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#004C97" />
            <Text style={styles.infoText}>{usuario?.correo_institucional}</Text>
          </View>
        </View>

        {/* DATOS PERSONALES */}
        <View style={styles.dataCard}>
          <Text style={styles.dataTitle}>Información personal</Text>

          {[
            { label: 'Documento',        value: `${usuario?.tipo_documento} ${usuario?.numero_documento}` },
            { label: 'Teléfono',         value: usuario?.telefono },
            { label: 'Cupo de artículos',value: `${usuario?.cupo_maximo_articulos} artículos` },
            { label: 'Fecha de registro',value: new Date(usuario?.fecha_registro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map((item, i) => (
            <View key={i} style={[styles.dataRow, i === 3 && { borderBottomWidth: 0 }]}>
              <Text style={styles.dataLabel}>{item.label}</Text>
              <Text style={styles.dataValue}>{item.value}</Text>
            </View>
          ))}

          <View style={[styles.dataRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.dataLabel}>Estado</Text>
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>
                {usuario?.estado === 'activo' ? 'Activo' : usuario?.estado}
              </Text>
            </View>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('../stackInterno/editarPerfil')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="pencil-outline" size={20} color="#004C97" />
            </View>
            <Text style={styles.actionText}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('../stackInterno/cambiarPassword')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.actionText}>Cambiar contraseña</Text>
            <View style={styles.twoBadge}>
              <Text style={styles.twoBadgeText}>2FA</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6F8" },
  scroll: { paddingHorizontal: 16, paddingBottom: 36 },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  avatarWrapper: { position: "relative", marginBottom: 16 },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: "#004C97",
  },

  editAvatar: {
    position: "absolute",
    bottom: 6, right: 6,
    backgroundColor: "#004C97",
    width: 34, height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  name: { fontSize: 22, fontWeight: "700", color: "#0F172A", textAlign: "center" },

  rolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    marginTop: 6,
    marginBottom: 12,
  },
  rolText: { fontSize: 13, fontWeight: "700" },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 14, color: "#004C97", fontWeight: "500" },

  dataCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  dataTitle: { fontSize: 16, fontWeight: "700", color: "#004C97", marginBottom: 14 },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  dataLabel: { fontSize: 14, color: "#888", fontWeight: "500" },
  dataValue: { fontSize: 14, color: "#333", fontWeight: "600", textAlign: "right", flexShrink: 1, maxWidth: "60%" },

  estadoBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  estadoText: { fontSize: 12, fontWeight: "700", color: "#16A34A" },

  actions: { gap: 12, marginBottom: 20 },

  actionBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  actionIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },

  twoBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  twoBadgeText: { fontSize: 11, fontWeight: "800", color: "#D97706" },
});