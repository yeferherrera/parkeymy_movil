import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,          
        tabBarShowLabel: false,      
        tabBarActiveTintColor: '#004C97',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="QR/index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="qrcode" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil/index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="parking/index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="car" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
