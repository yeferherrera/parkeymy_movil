import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="stackInterno/ayuda" />
      <Stack.Screen name="stackInterno/consultarRegistros" />
      <Stack.Screen name="stackInterno/detalleArticulo" />
      <Stack.Screen name="stackInterno/editarArticulo" />
      <Stack.Screen name="stackInterno/editarPerfil" />
      <Stack.Screen name="stackInterno/generarQR" />
      <Stack.Screen name="stackInterno/historial" />
      <Stack.Screen name="stackInterno/notificaciones" />
      <Stack.Screen name="stackInterno/nuevoReporte" />
      <Stack.Screen name="stackInterno/registrarArticulo" />
      <Stack.Screen name="stackInterno/reportes" />
      <Stack.Screen name="stackInterno/cambiarPassword" />
      <Stack.Screen name="stackVigilante/articulosFuera" />
      <Stack.Screen name="stackVigilante/escanearQr" />
      <Stack.Screen name="stackVigilante/validarQr" />
      <Stack.Screen name="stackVigilante/nuevoReporteVigilante" />
      <Stack.Screen name="stackVigilante/ayuda" />
    </Stack>
  );
}