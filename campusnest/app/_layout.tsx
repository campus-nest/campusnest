import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/use-color-scheme";
import { authService } from "@/src/services";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authService.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = authService
      .getSupabase()
      .auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return; // Still loading

    const inAuthGroup =
      segments[0] === "landing" ||
      segments[0] === "login" ||
      segments[0] === "signup" ||
      segments[0] === "pre-signup" ||
      segments[0] === "forgot-password" ||
      segments[0] === "reset-password" ||
      segments[0] === "enter-code" ||
      segments[0] === "verify-email" ||
      segments[0] === "index";

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but trying to access auth pages - redirect to home
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      // User is not authenticated and trying to access protected pages - redirect to landing
      router.replace("/landing");
    }
  }, [isAuthenticated, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="select-location"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="landing"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="pre-signup"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="listing"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="post"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="reset-password"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="enter-code"
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="verify-email"
          options={{ headerShown: false, gestureEnabled: true }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
