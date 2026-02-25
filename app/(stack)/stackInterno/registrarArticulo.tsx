import AppNav from "../../../components/ui/nav";
import CustomInput from "../../../components/input/customInput";
import SelectInput from "../../../components/input/selectInput";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator
} from "react-native";
import api from "../../services/api";

const CATEGORIAS = [
  { label: "Seleccione una categoría", value: "" },
  { label: "Tecnología", value: "1" },
  { label: "Equipos académicos", value: "2" },
  { label: "Herramientas", value: "3" },
  { label: "Instrumentos musicales", value: "4" },
  { label: "Objetos personales", value: "5" },
  { label: "Movilidad personal", value: "6" },
];

export default function RegistrarArticuloScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarArticulo = async () => {
    if (!nombre || !descripcion || !idCategoria) {
      Alert.alert("Campos requeridos", "Por favor completa nombre, descripción y categoría");
      return;
    }

    setLoading(true);
    try {
      await api.post('/articulos', {
        nombre,
        descripcion,
        id_categoria: idCategoria,
        numero_serie: numeroSerie,
        marca,
        modelo,
        color,
        observaciones,
      });

      Alert.alert("¡Éxito!", "Artículo registrado correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "No se pudo registrar el artículo";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Registrar artículo" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Información del artículo</Text>

          {/* Campos obligatorios */}
          <Text style={styles.sectionLabel}>Datos obligatorios</Text>

          <CustomInput
            label="Nombre del artículo *"
            placeholder="Ej: Portátil Lenovo ThinkPad"
            value={nombre}
            onChangeText={setNombre}
          />

          <CustomInput
            label="Descripción *"
            placeholder="Describe brevemente el artículo"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <SelectInput
            label="Categoría *"
            selectedValue={idCategoria}
            onValueChange={setIdCategoria}
            options={CATEGORIAS}
          />

          {/* Campos opcionales */}
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Datos adicionales</Text>

          <CustomInput
            label="Marca"
            placeholder="Ej: Lenovo, Apple, Samsung"
            value={marca}
            onChangeText={setMarca}
          />

          <CustomInput
            label="Modelo"
            placeholder="Ej: ThinkPad T14"
            value={modelo}
            onChangeText={setModelo}
          />

          <CustomInput
            label="Color"
            placeholder="Ej: Negro, Plateado"
            value={color}
            onChangeText={setColor}
          />

          <CustomInput
            label="Número de serie"
            placeholder="Ej: SN-LEN-2026-001"
            value={numeroSerie}
            onChangeText={setNumeroSerie}
          />

          <CustomInput
            label="Observaciones"
            placeholder="Alguna observación adicional"
            value={observaciones}
            onChangeText={setObservaciones}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={registrarArticulo}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Confirmar registro</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#03C04A",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});