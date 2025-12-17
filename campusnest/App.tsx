import React from "react";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
