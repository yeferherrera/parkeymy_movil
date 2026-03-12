import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert,
  Image,
  ScrollView,
  StyleSheet, Text, TouchableOpacity,
  View
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
  const [fotoActual, setFotoActual] = useState<string | null>(null);
  const [nuevaFoto, setNuevaFoto] = useState<string | null>(null);
  const [nuevaFotoUri, setNuevaFotoUri] = useState<string | null>(null);

  useEffect(() => { fetchArticulo(); }, []);

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
      setFotoActual(a.fotos?.[0]?.ruta_foto ?? a.fotos?.[0]?.url ?? null);
    } catch {
      Alert.alert("Error", "No se pudo cargar el artículo");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6, base64: true,
      allowsEditing: true, aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setNuevaFoto(result.assets[0].base64 ?? null);
      setNuevaFotoUri(result.assets[0].uri);
    }
  };

  const guardarCambios = async () => {
    if (!nombre || !idCategoria) {
      Alert.alert("Campos requeridos", "Completa nombre y categoría");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/articulos/${id}`, {
        nombre_articulo: nombre,
        descripcion, id_categoria: idCategoria,
        numero_serie: numeroSerie,
        marca, modelo, color, observaciones,
      });

      if (nuevaFoto) {
        try {
          await api.post(`/articulos/${id}/foto`, { foto: nuevaFoto });
        } catch {
          console.log('Error subiendo foto');
        }
      }

      Alert.alert("¡Éxito!", "Artículo actualizado correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  const eliminarArticulo = () => {
    Alert.alert(
      "Eliminar artículo",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar", style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/articulos/${id}`);
              Alert.alert("Eliminado", "Artículo eliminado correctamente", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch {
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

  const fotoMostrar = nuevaFotoUri ?? fotoActual;

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Editar artículo" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Editar información</Text>

          {/* FOTO */}
          <Text style={styles.sectionLabel}>Foto del artículo</Text>
          <TouchableOpacity
            style={[styles.fotoBox, fotoMostrar && styles.fotoBoxConFoto]}
            onPress={tomarFoto}
            activeOpacity={0.85}
          >
            {fotoMostrar ? (
              <>
                <Image source={{ uri: fotoMostrar }} style={styles.fotoPreview} />
                <View style={styles.fotoOverlay}>
                  <Ionicons name="camera-outline" size={20} color="#fff" />
                  <Text style={styles.fotoOverlayText}>
                    {nuevaFotoUri ? 'Cambiar foto' : 'Actualizar foto'}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.fotoPlaceholder}>
                <View style={styles.fotoIconWrap}>
                  <Ionicons name="camera-outline" size={30} color="#004C97" />
                </View>
                <Text style={styles.fotoPlaceholderTitle}>Agregar foto</Text>
                <Text style={styles.fotoPlaceholderSub}>Este artículo no tiene foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {nuevaFotoUri && (
            <View style={styles.nuevaFotoBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              <Text style={styles.nuevaFotoText}>Nueva foto lista para guardar</Text>
            </View>
          )}

          {/* DATOS */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Datos principales</Text>
          <CustomInput label="Nombre *" placeholder="Ej: Portátil Lenovo ThinkPad" value={nombre} onChangeText={setNombre} />
          <CustomInput label="Descripción" placeholder="Describe brevemente el artículo" value={descripcion} onChangeText={setDescripcion} />
          <SelectInput label="Categoría *" selectedValue={idCategoria} onValueChange={setIdCategoria} options={CATEGORIAS} />

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Datos adicionales</Text>
          <CustomInput label="Marca" placeholder="Ej: Lenovo" value={marca} onChangeText={setMarca} />
          <CustomInput label="Modelo" placeholder="Ej: ThinkPad T14" value={modelo} onChangeText={setModelo} />
          <CustomInput label="Color" placeholder="Ej: Negro" value={color} onChangeText={setColor} />
          <CustomInput label="Número de serie" placeholder="Ej: SN-001" value={numeroSerie} onChangeText={setNumeroSerie} />
          <CustomInput label="Observaciones" placeholder="Observación adicional" value={observaciones} onChangeText={setObservaciones} />

          <View style={{ gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.btnGuardar, saving && { opacity: 0.7 }]}
              onPress={guardarCambios} disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={styles.btnText}>Guardar cambios</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnEliminar} onPress={eliminarArticulo}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
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
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20,
    shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#004C97", textAlign: "center", marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },

  fotoBox: {
    borderRadius: 16, borderWidth: 2, borderColor: "#E5E7EB",
    borderStyle: "dashed", overflow: "hidden", height: 150, backgroundColor: "#F8FAFC",
  },
  fotoBoxConFoto: { borderStyle: "solid", borderColor: "#004C97" },
  fotoPreview: { width: "100%", height: "100%", resizeMode: "cover" },
  fotoOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10,
  },
  fotoOverlayText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  fotoPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  fotoIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  fotoPlaceholderTitle: { fontSize: 14, fontWeight: "700", color: "#374151" },
  fotoPlaceholderSub: { fontSize: 12, color: "#9CA3AF" },

  nuevaFotoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#D1FAE5', padding: 8, borderRadius: 8, marginTop: 8,
  },
  nuevaFotoText: { fontSize: 12, color: '#16A34A', fontWeight: '600' },

  btnGuardar: {
    backgroundColor: "#3CB371", height: 52, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnEliminar: {
    backgroundColor: "#E74C3C", height: 52, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});