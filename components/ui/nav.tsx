import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { storage } from "@/services/storage";

interface AppNavProps {
  title: string;
}

export default function AppNav({ title }: AppNavProps) {
  const router = useRouter();

  const handleBack = async () => {
    // Si hay pantallas anteriores simplemente regresa
    if (router.canGoBack()) {
      router.back();
      return;
    }

    // Si no hay historial, busca el rol en SecureStore
    try {
      const userData = await storage.getItem("user");
      const parsed = userData ? JSON.parse(userData) : null;
      const rol = Number(parsed?.id_rol);

      console.log("ROL DETECTADO:", rol);

      if (rol === 3) {
        router.replace("/(stack)/(tabs_vigilante)/home_vigilante");
        return;
      }

      router.replace("/(stack)/(tabs)/home");

    } catch (error) {
      console.log("Error leyendo usuario:", error);
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        <Pressable
          onPress={handleBack}
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { transform: [{ scale: 0.92 }] },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.backButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#004C97",
  },
  container: {
    height: 56,
    backgroundColor: "#004C97",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});