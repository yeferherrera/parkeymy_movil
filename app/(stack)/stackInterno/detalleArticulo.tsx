import CustomButton from "@/components/buttons/CustomButton";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import AppNav from '../../../components/ui/nav';


export default function DetalleArticuloScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F4F6F8] p-4">
      
      {/* Header con botón atrás y logo */}
       <AppNav title="Detalle artículo" />

      {/* Título */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#333",
          marginBottom: 20,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Detalle del Artículo
      </Text>

      {/* Card principal */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 16,
          marginBottom: 30,
          borderWidth: 1.5,
          borderColor: "#D0D4D9",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {/* Imagen */}
        <Image
          source={{
            uri: "https://i.ibb.co/yfQJ2t5/old-typewriter.jpg",
          }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 12,
            marginBottom: 15,
            resizeMode: "cover",
          }}
        />

        {/* Texto del detalle */}
        <View style={{ gap: 10 }}>
          <View>
            <Text style={{ fontWeight: "700", color: "#004C97" }}>
              Tipo de Artículo
            </Text>
            <Text style={{ color: "#444" }}>Ensayo Académico</Text>
          </View>

          <View>
            <Text style={{ fontWeight: "700", color: "#004C97" }}>
              Descripción
            </Text>
            <Text style={{ color: "#444" }}>
              Este artículo explora las tendencias actuales en la educación a distancia
              y su impacto en la formación continua.
            </Text>
          </View>

          <View>
            <Text style={{ fontWeight: "700", color: "#004C97" }}>
              Estado
            </Text>
            <Text style={{ color: "#3CB371", fontWeight: "600" }}>
              Aprobado
            </Text>
          </View>

          <View>
            <Text style={{ fontWeight: "700", color: "#004C97" }}>
              Último Movimiento
            </Text>
            <Text style={{ color: "#444" }}>
              Revisado el 12 de Octubre, 2023
            </Text>
          </View>
        </View>

        {/* Botón Cerrar */}
        <View style={{ marginTop: 20 }}>
          <CustomButton
            title="Cerrar"
            icon="exit"
            onPress={() => {}}
          />
        </View>
      </View>
    </ScrollView>
  );
}
