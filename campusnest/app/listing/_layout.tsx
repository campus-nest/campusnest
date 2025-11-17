import { Stack } from "expo-router";

export default function ListingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide the native header for all /listing/* screens
      }}
    />
  );
}
