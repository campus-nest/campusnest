import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationBar } from "../../components/navigation-bar";
export default function TabLayout() {
  return (
    <View style={styles.container}>
      <NavigationBar />
      {/* <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => {
              if (Platform.OS === "web") {
                return <span style={{ fontSize: 24 }}>🏠</span>;
              }
              return null;
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => {
              if (Platform.OS === "web") {
                return <span style={{ fontSize: 24 }}>🔍</span>;
              }
              return null;
            },
          }}
        />
      </Tabs> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
