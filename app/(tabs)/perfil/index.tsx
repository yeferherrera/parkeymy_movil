import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import CustomButton from "@/components/buttons/CustomButton";
import Header from "@/components/ui/header";


export default function PerfilAprendizScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F4F6F8] p-4">
      <Header showBack={true} />

      {/* Encabezado institucional */}
      <View
        style={{
          backgroundColor: "#004C97",
          paddingVertical: 14,
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Parkeymy
        </Text>
      </View>

      {/* Foto del usuario */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={{
            width: 110,
            height: 110,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: "#004C97",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
          }}
        />
      </View>

      {/* Información del usuario */}
      <View style={{ alignItems: "center", marginBottom: 25 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>
          María López
        </Text>

        <Text style={{ fontSize: 16, color: "#666", marginTop: 2 }}>
          Aprendiz
        </Text>

        <Text style={{ fontSize: 15, color: "#004C97", marginTop: 2 }}>
          marialopez@sena.edu.co
        </Text>
      </View>

      {/* Botones de opciones */}
      <View style={{ gap: 12 }}>
        <CustomButton
          title="Editar perfil"
          icon="edit"
          onPress={() => {}}
        />

        <CustomButton
          title="Cambiar contraseña"
          icon="edit"
          onPress={() => {}}
        />

        <CustomButton
          title="Cerrar sesión"
          icon="close"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}
