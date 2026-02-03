import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 10,
        marginTop: 40,
      }}
    >
      {/* Botón de volver */}
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 6, marginRight: 6 }}
        >
          <Ionicons name="arrow-back" size={26} color="#004C97" />
        </TouchableOpacity>
      ) : (
        // Espacio para que el logo quede centrado
        <View style={{ width: 32, marginRight: 6 }} />
      )}

      {/* Logo */}
      {/* <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("@/assets/Logo.png")}
          style={{
            width: 140,
            height: 45,
            resizeMode: "contain",
          }}
        />
      </View> */}

      {/* Espacio para balancear el header */}
      <View style={{ width: 50 }} />
    </View>
  );
}
  