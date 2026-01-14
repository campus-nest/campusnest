import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert
} from "react-native";

export default function ForgotPasswordScreen() {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        // Generic success message for security, or specific if preferred
        Alert.alert(
          "Check your email",
          "If an account exists for this email, you will receive a password reset code.",
          [
            {
              text: "Enter Code",
              onPress: () =>
                router.push({
                  pathname: "/enter-code",
                  params: { email: email.trim() },
                }),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>

        <H1>Forgot Password</H1>
        <H4>Enter your email to receive a reset code</H4>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address" />
        
        <Button fullWidth onPress={handleSendCode}>{loading ? "Sending..." : "Send Code"}</Button>
    </Screen>
  );
}
