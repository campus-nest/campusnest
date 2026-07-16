import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/src/services";
import { notifyAuthChanged } from "@/app/_layout";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { success, user, error: loginError } = await authService.signIn(
        email.trim(),
        password
      );

      if (!success || loginError) {
        Alert.alert("Login Failed", loginError || "An error occurred during sign in.");
        return;
      }

      // signIn already returns the user with their role and stores the token.
      if (!user) {
        Alert.alert("Error", "No user data returned from server.");
        return;
      }

      if (user.role === "student" || user.role === "landlord") {
        notifyAuthChanged();
        setTimeout(() => router.replace("/(tabs)"), 100);
      } else {
        Alert.alert("Error", "Unknown user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleBack = () => {
    router.back();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
    handleBack,
  };
}
