import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import CustomInput from "../../../components/input/customInput";
import SelectInput from "../../../components/input/selectInput";
import AppNav from "../../../components/ui/nav";
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

export default function EditarArticuloScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idCategoria, setIdCategoria] = useState("");

  useEffect(() => {
    fetchArticulo();
  }, []);

  const fetchArticulo = async () => {
    try {
      const response = await api.get(`/articulos/${id}`);
      const a = response.data;
      setNombre(a.nombre_articulo || "");
      setDescripcion(a.descripcion || "");
      setNumeroSerie(a.numero_serie || "");
      setMarca(a.marca || "");
      setModelo(a.modelo || "");
      setColor(a.color || "");
      setObservaciones(a.observaciones || "");
      setIdCategoria(String(a.id_categoria) || "");
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el artículo");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!nombre || !idCategoria) {
      Alert.alert("Campos requeridos", "Por favor completa nombre y categoría");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/articulos/${id}`, {
        nombre_articulo: nombre,
        descripcion,
        id_categoria: idCategoria,
        numero_serie: numeroSerie,
        marca,
        modelo,
        color,
        observaciones,
      });

      Alert.alert("¡Éxito!", "Artículo actualizado correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "No se pudo actualizar el artículo";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const eliminarArticulo = () => {
    Alert.alert(
      "Eliminar artículo",
      "¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/articulos/${id}`);
              Alert.alert("Eliminado", "El artículo fue eliminado correctamente", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el artículo");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Editar artículo" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Editar información</Text>

          <Text style={styles.sectionLabel}>Datos principales</Text>

          <CustomInput
            label="Nombre del artículo *"
            placeholder="Ej: Portátil Lenovo ThinkPad"
            value={nombre}
            onChangeText={setNombre}
          />

          <CustomInput
            label="Descripción"
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

          {/* Botones */}
          <View style={{ gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.btnGuardar, saving && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={guardarCambios}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Guardar cambios</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnEliminar}
              activeOpacity={0.8}
              onPress={eliminarArticulo}
            >
              <Text style={styles.btnText}>Eliminar artículo</Text>
            </TouchableOpacity>
          </View>
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
  btnGuardar: {
    backgroundColor: "#3CB371",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btnEliminar: {
    backgroundColor: "#E74C3C",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});