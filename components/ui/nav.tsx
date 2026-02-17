import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppNavProps {
  title: string;
}

export default function AppNav({ title }: AppNavProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        
        {/* Botón volver */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Placeholder para balancear el centro */}
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

    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },

    // sombra Android
    elevation: 6,
  },
  backButton: {
    width: 40,
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
