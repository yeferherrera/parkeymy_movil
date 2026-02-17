import { Stack } from 'expo-router';

export default function StackInternoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí vive el layout de tabs */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(tabs_vigilante)" />

      {/* Pantallas SIN barra inferior */}
      <Stack.Screen name="ayuda" />
      <Stack.Screen name="consultarRegistros" />
      <Stack.Screen name="detalleArticulo" />
      <Stack.Screen name="editarArticulo" />
      <Stack.Screen name="registrarArticulo" />
    </Stack>
  );
}
