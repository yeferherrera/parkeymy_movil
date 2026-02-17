import CustomButton from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View, Dimensions } from "react-native";
import AppNav from "../../../components/ui/nav";

const { width } = Dimensions.get("window");

export default function MisArticulosScreen() {
  const router = useRouter();

  const articles = [
    {
      title: "Nombre del artículo 1",
      type: "Investigación",
      date: "12/09/2023",
      id: "123456",
      status: "Dentro",
      statusColor: "#3CB371",
    },
    {
      title: "Nombre del artículo 2",
      type: "Editorial",
      date: "05/08/2023",
      id: "123456",
      status: "Fuera",
      statusColor: "#E74C3C",
    },
    {
      title: "Nombre del artículo 3",
      type: "Análisis",
      date: "21/07/2023",
      id: "123456",
      status: "Dentro",
      statusColor: "#3CB371",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      {/* NAV FIJO */}
      <AppNav title="Consultar registros" />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={{
              width: width * 0.4,
              maxWidth: 160,
              height: 50,
              resizeMode: "contain",
            }}
          />
        </View>

        {/* Título */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#004C97",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Mis artículos
        </Text>

        {/* Cards */}
        {articles.map((article, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 4,
            }}
          >
            {/* Header card */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#004C97",
                  flexShrink: 1,
                }}
              >
                {article.title}
              </Text>

              {/* Estado */}
              <View
                style={{
                  backgroundColor: article.statusColor + "22",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: article.statusColor,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {article.status}
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 14, color: "#555" }}>
                Tipo: {article.type}
              </Text>
              <Text style={{ fontSize: 14, color: "#555" }}>
                Fecha registro: {article.date}
              </Text>
              <Text style={{ fontSize: 13, color: "#888" }}>
                ID: {article.id}
              </Text>
            </View>

            {/* Botones RESPONSIVOS */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 16,
              }}
            >
              <View style={{ flexGrow: 1, minWidth: 140 }}>
                <CustomButton
                  title="detalles"
                  icon="eye"
                  onPress={() =>
                    router.push("/stackInterno/detalleArticulo")
                  }
                />
              </View>

              <View style={{ flexGrow: 1, minWidth: 140 }}>
                <CustomButton
                  title="Editar"
                  icon="edit"
                  onPress={() =>
                    router.push("/stackInterno/editarArticulo")
                  }
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
