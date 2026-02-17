import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppNav from "../../../components/ui/nav";

export default function MisReportes() {
  const router = useRouter();

  const reportes = [
    {
      id: "1",
      titulo: "Reporte de artículo electrónico",
      fecha: "10/01/2026",
      estado: "Enviado",
    },
    {
      id: "2",
      titulo: "Reporte de vehículo",
      fecha: "05/01/2026",
      estado: "Pendiente",
    },
  ];

  const renderItem = ({ item }: any) => {
    const enviado = item.estado === "Enviado";

    return (
      <View style={styles.card}>
        {/* Icono */}
        <View style={styles.iconBox}>
          <FontAwesome name="file-text" size={22} color="#004C97" />
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.date}>Fecha: {item.fecha}</Text>
        </View>

        {/* Estado */}
        <View
          style={[
            styles.statusBadge,
            enviado ? styles.sentBg : styles.pendingBg,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              enviado ? styles.sentText : styles.pendingText,
            ]}
          >
            {item.estado}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* NAV FIJO */}
      <AppNav title="Mis reportes" />

      {/* LISTA */}
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/stackInterno/nuevoReporte")}
      >
        <FontAwesome name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.fabText}>Nuevo reporte</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  list: {
    padding: 16,
    paddingBottom: 100, // espacio para el FAB
  },

  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E6EEF7",
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  sentBg: {
    backgroundColor: "#DCFCE7",
  },

  sentText: {
    color: "#16A34A",
  },

  pendingBg: {
    backgroundColor: "#FEF3C7",
  },

  pendingText: {
    color: "#F59E0B",
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    backgroundColor: "#004C97",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  fabText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
