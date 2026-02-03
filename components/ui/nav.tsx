import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface AppNavProps {
  title: string;
}

export default function AppNav({ title }: AppNavProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* Botón volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Espacio vacío para centrar el título */}
      <View style={{ width: 24 }} />

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: 56,
    backgroundColor: '#004C97', // Azul SENA
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
