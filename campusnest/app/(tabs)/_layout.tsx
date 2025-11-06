import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => {
            if (Platform.OS === 'web') {
              return <span style={{ fontSize: 24 }}>🏠</span>;
            }
            return null;
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => {
            if (Platform.OS === 'web') {
              return <span style={{ fontSize: 24 }}>🔍</span>;
            }
            return null;
          },
        }}
      />
    </Tabs>
  );
}