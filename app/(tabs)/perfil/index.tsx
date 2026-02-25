import React, { useEffect, useState } from "react";
import {
  View, Text, Image, ScrollView, StyleSheet,
  Dimensions, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppNav from "../../../components/ui/nav";
import CustomButton from "@/components/buttons/CustomButton";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.34;

export default function PerfilAprendizScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const response = await api.get('/perfil');
      setUsuario(response.data.usuario);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post('/logout');
            } catch (_) {}
            await SecureStore.deleteItemAsync('token');
            router.replace('/login');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppNav title="Perfil" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                usuario?.foto_perfil
                  ? { uri: usuario.foto_perfil }
                  : { uri: "https://i.pravatar.cc/300" }
              }
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{usuario?.nombres} {usuario?.apellidos}</Text>
          <Text style={styles.role}>{usuario?.rol?.nombre_rol} SENA</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#004C97" />
            <Text style={styles.infoText}>{usuario?.correo_institucional}</Text>
          </View>
        </View>

        {/* DATOS */}
        <View style={styles.dataCard}>
          <Text style={styles.dataTitle}>Información personal</Text>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Documento</Text>
            <Text style={styles.dataValue}>{usuario?.tipo_documento} {usuario?.numero_documento}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Teléfono</Text>
            <Text style={styles.dataValue}>{usuario?.telefono}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Estado</Text>
            <Text style={[styles.dataValue, { color: '#3CB371', fontWeight: '700' }]}>
              {usuario?.estado === 'activo' ? 'Activo' : usuario?.estado}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Cupo de artículos</Text>
            <Text style={styles.dataValue}>{usuario?.cupo_maximo_articulos} artículos</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Fecha de registro</Text>
            <Text style={styles.dataValue}>
              {new Date(usuario?.fecha_registro).toLocaleDateString('es-CO', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.actions}>
          <CustomButton title="Editar perfil" icon="edit" onPress={() => {}} />
          <CustomButton title="Cambiar contraseña" icon="lock" onPress={() => {}} />
          <CustomButton title="Cerrar sesión" icon="close" onPress={cerrarSesion} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6F8" },
  scroll: { paddingHorizontal: 16, paddingBottom: 36 },

  profileCard: {
    backgroundColor: "#FFFFFF",
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
    bottom: 6,
    right: 6,
    backgroundColor: "#004C97",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  name: { fontSize: 22, fontWeight: "700", color: "#0F172A", textAlign: "center" },
  role: { fontSize: 14, fontWeight: "600", color: "#16A34A", marginTop: 4, marginBottom: 10 },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 14, color: "#004C97", fontWeight: "500" },

  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  dataTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#004C97",
    marginBottom: 14,
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  dataLabel: { fontSize: 14, color: "#888", fontWeight: "500" },
  dataValue: { fontSize: 14, color: "#333", fontWeight: "600", textAlign: "right", flexShrink: 1, maxWidth: "60%" },

  actions: { gap: 14 },
});