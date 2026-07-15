import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/use-color-scheme";
import { authService } from "@/src/services";
import { SavedPostsProvider } from "@/src/context/SavedPostsContext";
import { SavedListingsProvider } from "@/src/context/SavedListingsContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authService.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

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
    if (isAuthenticated === null) return;

    const inAuthGroup =
      segments[0] === "landing" ||
      segments[0] === "login" ||
      segments[0] === "signup" ||
      segments[0] === "pre-signup" ||
      segments[0] === "forgot-password" ||
      segments[0] === "reset-password" ||
      segments[0] === "enter-code" ||
      segments[0] === "verify-email" ||
      pathname === "/";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      router.replace("/landing");
    }
  }, [isAuthenticated, pathname, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SavedPostsProvider>
        <SavedListingsProvider>
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
              name="complete-profile"
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
        </SavedListingsProvider>
      </SavedPostsProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
