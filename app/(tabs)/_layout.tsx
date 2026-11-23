import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { TabBar } from '@/src/components/navigation/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ animation: 'none', headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Componentes',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color as string} name={focused ? 'grid' : 'grid-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="screens"
        options={{
          title: 'Pantallas',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color as string} name={focused ? 'phone-portrait' : 'phone-portrait-outline'} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
