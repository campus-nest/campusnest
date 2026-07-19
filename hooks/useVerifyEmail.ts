import { useState, useEffect } from "react";
import { Alert, Keyboard } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authService } from "@/src/services";

export function useVerifyEmail() {
  const router = useRouter();
  const { email: initialEmail } = useLocalSearchParams<{ email: string }>();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail || "");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === 6) Keyboard.dismiss();
  }, [code]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }
    if (code.trim().length !== 6) {
      Alert.alert("Error", "Verification code must be 6 digits");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Email address missing. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await authService.verifyEmailOtp(email.trim(), code.trim());
      if (error || !success) {
        Alert.alert("Error", error || "Failed to verify code.");
      } else {
        Alert.alert("Success", "Email verified! You can now log in.", [
          { text: "OK", onPress: () => router.replace("/login") }
        ]);
      }
    } catch (err) {
      console.error("Verify code error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    code,
    setCode,
    handleVerifyCode,
    handleResendEmail,
    handleBackToLogin,
  };
}
