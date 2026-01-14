import { Slot } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
