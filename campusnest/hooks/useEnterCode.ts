import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { authService } from "@/src/services";

export function useEnterCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.back();
      return;
    }
    setLoading(true);
    try {
      const { success, error } = await authService.verifyRecoveryOtp(email, code.trim());
      if (error || !success) {
        Alert.alert("Error", error || "Failed to verify code.");
      } else {
        router.replace("/reset-password");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    code,
    setCode,
    loading,
    handleVerifyCode,
  };
}
