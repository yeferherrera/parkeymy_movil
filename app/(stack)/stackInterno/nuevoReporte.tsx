import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomInput from "@/components/input/customInput";
import SelectInput from "@/components/input/selectInput";
import AppNav from "@/components/ui/nav";

export default function NuevoReporte() {
  const [tipoReporte, setTipoReporte] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      {/* NAV FIJO */}
      <AppNav title="Nuevo reporte" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD FORMULARIO */}
        <View style={styles.card}>
          <Text style={styles.title}>Información del reporte</Text>

          {/* Tipo */}
          <SelectInput
            label="Tipo de reporte"
            selectedValue={tipoReporte}
            onValueChange={setTipoReporte}
            options={[
              { label: "Seleccione una opción", value: "" },
              { label: "Artículo", value: "articulo" },
              { label: "Vehículo", value: "vehiculo" },
              { label: "Incidente", value: "incidente" },
            ]}
          />

          {/* Título */}
          <CustomInput
            label="Título del reporte"
            placeholder="Ej: Daño en artículo electrónico"
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* Descripción */}
          <CustomInput
            label="Descripción"
            placeholder="Describe el reporte..."
            value={descripcion}
            onChangeText={setDescripcion}
            
          />

          {/* Fecha */}
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Fecha de registro</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Botón */}
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Enviar reporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004C97",
    textAlign: "center",
    marginBottom: 20,
  },

  dateBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  dateLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  button: {
    backgroundColor: "#004C97",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
