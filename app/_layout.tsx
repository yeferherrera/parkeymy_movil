import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login_vigilante/index" />
      <Stack.Screen name="(stack)" />
      <Stack.Screen name="(tabs_vigilante)" />
    </Stack>
  );
}