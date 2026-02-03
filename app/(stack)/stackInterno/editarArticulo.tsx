import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppNav from '../../../components/ui/nav';


export default function EditarArticuloScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F4F6F8] p-4">
      
      {/* Header con botón atrás */}
       <AppNav title="Editar artículo" />

      {/* Encabezado */}
     

      {/* Card del formulario */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 18,
          marginBottom: 40,
          borderWidth: 1.5,
          borderColor: "#D0D4D9",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {/* INPUT: Nombre del artículo */}
        <Text style={{ fontWeight: "700", color: "#004C97", marginBottom: 4 }}>
          Nombre del artículo
        </Text>
        <TextInput
          placeholder="Ingrese el nombre"
          placeholderTextColor="#999"
          style={{
            backgroundColor: "#F4F6F8",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#D0D4D9",
          }}
        />

        {/* INPUT: Tipo */}
        <Text style={{ fontWeight: "700", color: "#004C97", marginBottom: 4 }}>
          Tipo
        </Text>
        <TextInput
          placeholder="Ingrese el tipo"
          placeholderTextColor="#999"
          style={{
            backgroundColor: "#F4F6F8",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#D0D4D9",
          }}
        />

        {/* INPUT: Descripción */}
        <Text style={{ fontWeight: "700", color: "#004C97", marginBottom: 4 }}>
          Descripción
        </Text>
        <TextInput
          placeholder="Ingrese la descripción"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: "#F4F6F8",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#D0D4D9",
            textAlignVertical: "top",
          }}
        />

        {/* INPUT: Número de serie */}
        <Text style={{ fontWeight: "700", color: "#004C97", marginBottom: 4 }}>
          Número de serie/Identificación
        </Text>
        <TextInput
          placeholder="Ingrese el número de serie/ID"
          placeholderTextColor="#999"
          style={{
            backgroundColor: "#F4F6F8",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#D0D4D9",
          }}
        />

        {/* Subir imagen */}
        <Text style={{ fontWeight: "700", color: "#004C97", marginBottom: 6 }}>
          Foto
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#004C97",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Subir imagen</Text>
        </TouchableOpacity>

        {/* Botones */}
        <View style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#3CB371",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#E74C3C",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Eliminar artículo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
