import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/src/services";

export function useVerifyEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { success, error } = await authService.resendSignUpEmail(email.trim());
      if (error || !success) {
        Alert.alert("Error", error || "Failed to resend verification email");
      } else {
        Alert.alert("Success", "Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to resend verification email");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return {
    loading,
    email,
    setEmail,
    handleResendEmail,
    handleBackToLogin,
  };
}
