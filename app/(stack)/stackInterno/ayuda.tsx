import React from "react";
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppNav from '../../../components/ui/nav';
import { router } from "expo-router";




export default function AyudaYSoporteScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F4F6F8] p-4">
      
      {/* Header */}
       <AppNav title="Ayuda" />

      {/* Título */}
    

      {/* Descripción */}
      <Text
        style={{
          marginTop: 40,
          textAlign: "center",
          color: "#333",
          fontSize: 20,
          marginBottom: 30,
        }}
      >
        Aquí puedes consultar tu historial y revisar{"\n"}
        tus notificaciones importantes.
      </Text>

      {/* Botón: Ver historial */}
      <TouchableOpacity onPress={() => router.push('/stackInterno/historial')}
        style={{
          backgroundColor: "#EEF5FF",
          borderColor: "#004C97",
          borderWidth: 1.5,
          paddingVertical: 14,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#004C97",
          }}
        >
          Ver Historial
        </Text>
      </TouchableOpacity>

      {/* Botón: Notificaciones */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FFF9E6",
          borderColor: "#F1C40F",
          borderWidth: 1.5,
          paddingVertical: 14,
          borderRadius: 10,
          marginBottom: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#C79600",
          }}
        >
          Notificaciones
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#E0E0E0",
          paddingTop: 20,
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <Pressable
  onPress={() =>
    Alert.alert(
      'Contacto soporte',
      'correo: \n'+
      'yefersonyefersonherrera123@gmail.com \n' +
      'teléfono: +57 317 684 6802',
      
    )
  }
>
  <Text style={{
  textAlign: "center",
  marginTop: 30,
  marginBottom: 15,
  fontSize: 23,
  color: '#3b49ca',
  fontWeight: '600',
  textDecorationLine: 'underline',

  }}>
    ¿Necesitas más ayuda? Contáctanos
  </Text>
</Pressable>

      </View>
    </ScrollView>
  );
}

