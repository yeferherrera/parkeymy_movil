import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppNav from "../../../components/ui/nav";
import CustomButton from "@/components/buttons/CustomButton";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.34;

export default function PerfilAprendizScreen() {
  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <AppNav title="Perfil" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              style={styles.avatar}
            />

            {/* Edit avatar */}
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>María López</Text>
          <Text style={styles.role}>Aprendiz SENA</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#004C97" />
            <Text style={styles.infoText}>
              marialopez@sena.edu.co
            </Text>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.actions}>
          <CustomButton
            title="Editar perfil"
            icon="edit"
            onPress={() => {}}
          />

          <CustomButton
            title="Cambiar contraseña"
            icon="lock"
            onPress={() => {}}
          />

          <CustomButton
            title="Cerrar sesión"
            icon="close"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 28,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },

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

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  role: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
    marginTop: 4,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#004C97",
    fontWeight: "500",
  },

  actions: {
    gap: 14,
  },
});
