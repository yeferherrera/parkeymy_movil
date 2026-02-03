import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title:'Inicio', 
          headerTitleAlign: 'center',
          tabBarIcon: ({ color}) => <FontAwesome size={30} name="home" color={color} />,
        }}
      />
          <Tabs.Screen
            name="QR/index"
            options={{
              title: 'QR',
              tabBarIcon: ({ color }) => <FontAwesome size={30} name="qrcode" color={color} />,
            }}
          />
        <Tabs.Screen
          name="perfil/index"
          options={{
            title: 'perfil',
            tabBarIcon: ({ color }) => <FontAwesome size={30} name="user" color={color} />,
          }}
        />

        <Tabs.Screen
          name="parking/index"
          options={{
            title: 'parking',
            tabBarIcon: ({ color }) => <FontAwesome size={30} name="car" color={color} />,
          }}
        />
        
    </Tabs>
  );
}
