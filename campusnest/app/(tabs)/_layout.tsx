import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { NavigationBar } from "@/components/navigation-bar";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && <NavigationBar />}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="new_post" />
        <Tabs.Screen name="users" />
        <Tabs.Screen name="profile" />
        </Tabs>
      {Platform.OS !== 'web' && <NavigationBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
