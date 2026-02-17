import AppNav from "../../../components/ui/nav";
import CustomInput from "../../../components/input/customInput";
import SelectInput from "../../../components/input/selectInput";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";


export default function RegistrarArticuloScreen() {
  const router = useRouter();

  const [descripcion, setDescripcion] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [tipoArticulo, setTipoArticulo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registrarArticulo = () => {
    if (!descripcion || !identificacion || !tipoArticulo) {
      setError("Por favor complete todos los campos");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Artículo registrado correctamente");

    setTimeout(() => {
      router.push("/(tabs)/home");
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      {/* NAV FIJO */}
      <AppNav title="Registrar artículo" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card formulario */}
        <View style={styles.card}>
          <Text style={styles.title}>Información del artículo</Text>

          <CustomInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <CustomInput
            label="Identificación"
            placeholder="Ingrese la identificación"
            value={identificacion}
            onChangeText={setIdentificacion}
          />

          <SelectInput
            label="Tipo de artículo"
            selectedValue={tipoArticulo}
            onValueChange={setTipoArticulo}
            options={[
              { label: "Seleccione una opción", value: "" },
              { label: "Electrónico", value: "electrico" },
              { label: "Vehículo", value: "vehiculo" },
              { label: "Personal", value: "personal" },
            ]}
          />

          {/* Botón responsivo */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={registrarArticulo}
          >
            <Text style={styles.buttonText}>Confirmar registro</Text>
          </TouchableOpacity>

          {/* Mensajes */}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
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

  button: {
    backgroundColor: "#03C04A",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  error: {
    color: "#E74C3C",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },

  success: {
    color: "#2ECC71",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
});
