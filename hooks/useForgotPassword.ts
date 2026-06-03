import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/src/services";

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const { success, error } = await authService.sendPasswordResetEmail(email.trim());
      if (error || !success) {
        Alert.alert("Error", error || "Failed to send reset code.");
      } else {
        Alert.alert(
          "Check your email",
          "If an account exists for this email, you will receive a password reset code.",
          [{
            text: "Enter Code",
            onPress: () => router.push({ pathname: "/enter-code", params: { email: email.trim() } }),
          }],
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleSendCode,
  };
}
