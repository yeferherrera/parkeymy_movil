import CustomButton from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import AppNav from '../../../components/ui/nav';

const router = useRouter();


export default function MisArticulosScreen() {
  const articles = [
    {
      title: "Nombre del artículo 1",
      type: "Investigación",
      date: "12/09/2023",
      id: "123456",
      status: "Dentro",
      statusColor: "#3CB371",
    },
    {
      title: "Nombre del artículo 2",
      type: "Editorial",
      date: "05/08/2023",
      id: "123456",
      status: "Fuera",
      statusColor: "#E74C3C",
    },
    {
      title: "Nombre del artículo 3",
      type: "Análisis",
      date: "21/07/2023",
      id: "123456",
      status: "Dentro",
      statusColor: "#3CB371",
    },
  ];

  return (

    <ScrollView className="flex-1 bg-[#F4F6F8] p-4">

    
      {/* Header con logo */}
       <AppNav title="Consultar registros" />

      <View className="w-full flex-row items-center mb-4">
    
        


    <View className="flex-1 items-center">
        <Image
          source={require('../../../assets/images/Logo.png')}
          style={{
            width: 140,
            height: 50,
            resizeMode: "contain",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 3 },
            marginBottom: 10,
            marginTop: 20,
          }}
        />
      </View>
    </View>
      <Text className="text-2xl font-bold mb-4 text-[#004C97] text-center">Mis artículos</Text>

      {articles.map((article, index) => (
  <View
    key={index}
    className="bg-white p-5 rounded-3xl shadow-lg mb-8 border border-gray-300"
    style={{
      borderWidth: 1.5,
      borderColor: "#D0D4D9",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      backgroundColor: "#FFFFFF",
      gap: 6,
      marginBottom: 10,
    }}
  >
    <Text className="text-lg font-semibold text-[#004C97]">{article.title}</Text>

    <Text className="text-gray-700 text-sm">Tipo: {article.type}</Text>
    <Text className="text-gray-700 text-sm">Fecha registro: {article.date}</Text>
    <Text className="text-gray-700 text-sm">ID: {article.id}</Text>

    <Text className="text-sm font-semibold" style={{ color: article.statusColor }}>
      Estado: {article.status}
    </Text>

    {/* Botones responsivos y profesionales */}
    <View className="mt-4 flex-row flex-wrap gap-3">
      <View className="flex-1 min-w-[130px]">
        <CustomButton title="Detalles" icon="close" onPress={() => router.push('/stackInterno/detalleArticulo')} />
      </View>

      <View className="flex-1 min-w-[130px]">
        <CustomButton title="Editar" icon="edit" onPress={() => router.push('/stackInterno/editarArticulo')} />
      </View>
    </View>
  </View>
))}
    </ScrollView>
  );
}