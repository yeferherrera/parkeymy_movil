import CustomButton from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, Dimensions, ActivityIndicator, Alert } from "react-native";
import AppNav from "../../../components/ui/nav";
import api from "../../services/api";

const { width } = Dimensions.get("window");

const getEstadoConfig = (estado: string) => {
  switch (estado) {
    case 'en_sede':
      return { label: 'En sede', color: '#3CB371' };
    case 'retirado':
      return { label: 'Retirado', color: '#F39C12' };
    case 'registrado':
      return { label: 'Registrado', color: '#3498DB' };
    default:
      return { label: estado, color: '#888' };
  }
};

export default function MisArticulosScreen() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const response = await api.get('/mis-articulos');
      setArticles(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los artículos');
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <AppNav title="Consultar registros" />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={{ width: width * 0.4, maxWidth: 160, height: 50, resizeMode: "contain" }}
          />
        </View>

        <Text style={{ fontSize: 22, fontWeight: "700", color: "#004C97", textAlign: "center", marginBottom: 20 }}>
          Mis artículos
        </Text>

        {articles.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
            No tienes artículos registrados
          </Text>
        ) : (
          articles.map((article: any, index: number) => {
            const estadoConfig = getEstadoConfig(article.estado_articulo);
            return (
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
                {/* Header */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#004C97", flexShrink: 1 }}>
                    {article.nombre_articulo}
                  </Text>

                  <View style={{
                    backgroundColor: estadoConfig.color + "22",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}>
                    <Text style={{ color: estadoConfig.color, fontSize: 12, fontWeight: "600" }}>
                      {estadoConfig.label}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "#555" }}>
                    Tipo: {article.categoria?.nombre_categoria}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#555" }}>
                    Marca: {article.marca} — Modelo: {article.modelo}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#555" }}>
                    Fecha registro: {new Date(article.fecha_registro).toLocaleDateString('es-CO')}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#666", fontWeight: "600" }}>
                    N° Serie: {article.numero_serie}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#004C97", fontWeight: "700" }}>
                    ID: #{article.id_articulo}
                  </Text>
                </View>

                {/* Botones */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                  <View style={{ flexGrow: 1, minWidth: 140 }}>
                    <CustomButton
                    title="Detalles"
                    icon="eye"
                    onPress={() => router.push(`/stackInterno/detalleArticulo?id=${article.id_articulo}`)}
                    />
                </View>

  {article.estado_articulo !== 'en_sede' && (
    <View style={{ flexGrow: 1, minWidth: 140 }}>
      <CustomButton
        title="Editar"
        icon="edit"
        onPress={() => router.push(`/stackInterno/editarArticulo?id=${article.id_articulo}`)}
      />
    </View>
    )}              
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}