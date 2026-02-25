import CustomButton from "@/components/buttons/CustomButton";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, ActivityIndicator, Alert } from "react-native";
import AppNav from '../../../components/ui/nav';
import { router, useLocalSearchParams } from "expo-router";
import api from "../../services/api";

const getEstadoConfig = (estado: string) => {
  switch (estado) {
    case 'en_sede': return { label: 'En sede', color: '#3CB371' };
    case 'retirado': return { label: 'Retirado', color: '#F39C12' };
    case 'registrado': return { label: 'Registrado', color: '#3498DB' };
    default: return { label: estado, color: '#888' };
  }
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontWeight: "700", color: "#004C97", fontSize: 13 }}>{label}</Text>
    <Text style={{ color: "#444", fontSize: 14, marginTop: 2 }}>{value || "—"}</Text>
  </View>
);

export default function DetalleArticuloScreen() {
  const { id } = useLocalSearchParams();
  const [articulo, setArticulo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticulo();
  }, []);

  const fetchArticulo = async () => {
    try {
      const response = await api.get(`/articulos/${id}`);
      setArticulo(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el artículo");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#004C97" />
      </View>
    );
  }

  const estadoConfig = getEstadoConfig(articulo?.estado_articulo);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Detalle artículo" />

      <View style={{ padding: 16, paddingBottom: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 20, marginTop: 10, textAlign: "center" }}>
          Detalle del Artículo
        </Text>

        <View style={{
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
        }}>
          {/* Foto si existe */}
          {articulo?.fotos?.length > 0 && (
            <Image
              source={{ uri: articulo.fotos[0].url }}
              style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 15, resizeMode: "cover" }}
            />
          )}

          {/* Estado badge */}
          <View style={{ alignItems: "flex-start", marginBottom: 16 }}>
            <View style={{ backgroundColor: estadoConfig.color + "22", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ color: estadoConfig.color, fontWeight: "700", fontSize: 13 }}>
                {estadoConfig.label}
              </Text>
            </View>
          </View>

          {/* Info */}
          <InfoRow label="Nombre" value={articulo?.nombre_articulo} />
          <InfoRow label="Categoría" value={articulo?.categoria?.nombre_categoria} />
          <InfoRow label="Descripción" value={articulo?.descripcion} />
          <InfoRow label="Marca" value={articulo?.marca} />
          <InfoRow label="Modelo" value={articulo?.modelo} />
          <InfoRow label="Color" value={articulo?.color} />
          <InfoRow label="N° Serie" value={articulo?.numero_serie} />
          <InfoRow label="Observaciones" value={articulo?.observaciones} />
          <InfoRow
            label="Fecha de registro"
            value={new Date(articulo?.fecha_registro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
          <InfoRow
            label="Última modificación"
            value={new Date(articulo?.fecha_ultima_modificacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          />

          <View style={{ marginTop: 20 }}>
            <CustomButton title="Cerrar" icon="exit" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}