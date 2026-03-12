import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import CustomInput from "../../../components/input/customInput";
import SelectInput from "../../../components/input/selectInput";
import AppNav from "../../../components/ui/nav";
import api from "../../../services/api";

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
  const [foto, setFoto] = useState<string | null>(null); // base64
  const [fotoUri, setFotoUri] = useState<string | null>(null); // preview

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara para tomar la foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].base64 ?? null);
      setFotoUri(result.assets[0].uri);
    }
  };

  const registrarArticulo = async () => {
    if (!nombre || !descripcion || !idCategoria) {
      Alert.alert("Campos requeridos", "Por favor completa nombre, descripción y categoría");
      return;
    }

    setLoading(true);
    try {
      // 1. Registrar artículo
      const res = await api.post('/articulos', {
        nombre,
        descripcion,
        id_categoria: idCategoria,
        numero_serie: numeroSerie,
        marca, modelo, color, observaciones,
      });

      const idArticulo = res.data.id_articulo;

      // 2. Subir foto si existe
      if (foto && idArticulo) {
        try {
          await api.post(`/articulos/${idArticulo}/foto`, { foto });
        } catch {
          // No bloqueamos el registro si falla la foto
          console.log('Error subiendo foto, artículo registrado sin foto');
        }
      }

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

          {/* FOTO */}
          <Text style={styles.sectionLabel}>Foto del artículo</Text>

          <TouchableOpacity
            style={[styles.fotoBox, fotoUri && styles.fotoBoxConFoto]}
            onPress={tomarFoto}
            activeOpacity={0.85}
          >
            {fotoUri ? (
              <>
                <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
                <View style={styles.fotoOverlay}>
                  <Ionicons name="camera-outline" size={22} color="#fff" />
                  <Text style={styles.fotoOverlayText}>Cambiar foto</Text>
                </View>
              </>
            ) : (
              <View style={styles.fotoPlaceholder}>
                <View style={styles.fotoIconWrap}>
                  <Ionicons name="camera-outline" size={32} color="#004C97" />
                </View>
                <Text style={styles.fotoPlaceholderTitle}>Tomar foto</Text>
                <Text style={styles.fotoPlaceholderSub}>Opcional — ayuda a identificar el artículo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* DATOS OBLIGATORIOS */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Datos obligatorios</Text>

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

          {/* DATOS ADICIONALES */}
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Datos adicionales</Text>

          <CustomInput label="Marca" placeholder="Ej: Lenovo, Apple, Samsung" value={marca} onChangeText={setMarca} />
          <CustomInput label="Modelo" placeholder="Ej: ThinkPad T14" value={modelo} onChangeText={setModelo} />
          <CustomInput label="Color" placeholder="Ej: Negro, Plateado" value={color} onChangeText={setColor} />
          <CustomInput label="Número de serie" placeholder="Ej: SN-LEN-2026-001" value={numeroSerie} onChangeText={setNumeroSerie} />
          <CustomInput label="Observaciones" placeholder="Alguna observación adicional" value={observaciones} onChangeText={setObservaciones} />

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
    fontSize: 20, fontWeight: "700",
    color: "#004C97", textAlign: "center", marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 13, fontWeight: "700",
    color: "#888", textTransform: "uppercase",
    letterSpacing: 0.8, marginBottom: 10,
  },

  // FOTO
  fotoBox: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    overflow: "hidden",
    height: 160,
    backgroundColor: "#F8FAFC",
  },

  fotoBoxConFoto: {
    borderStyle: "solid",
    borderColor: "#004C97",
  },

  fotoPreview: {
    width: "100%", height: "100%",
    resizeMode: "cover",
  },

  fotoOverlay: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
  },

  fotoOverlayText: {
    color: "#fff", fontSize: 13, fontWeight: "700",
  },

  fotoPlaceholder: {
    flex: 1, alignItems: "center",
    justifyContent: "center", gap: 6,
  },

  fotoIconWrap: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },

  fotoPlaceholderTitle: {
    fontSize: 15, fontWeight: "700", color: "#374151",
  },

  fotoPlaceholderSub: {
    fontSize: 12, color: "#9CA3AF", textAlign: "center",
  },

  button: {
    backgroundColor: "#03C04A",
    height: 52, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
    marginTop: 18,
  },

  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});