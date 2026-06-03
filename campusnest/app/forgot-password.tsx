import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { supabase } from "@/src/lib/supabaseClient";
import { colors, spacing } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

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
        Alert.alert(
          "Check your email",
          "If an account exists for this email, you will receive a password reset code.",
          [{
            text: "Enter Code",
            onPress: () => router.push({ pathname: "/enter-code", params: { email: email.trim() } }),
          }],
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
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <H1 bold>Forgot Password</H1>
        <H4 style={styles.subtitle}>Enter your email to receive a reset code</H4>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <Button fullWidth disabled={loading} onPress={handleSendCode}>
        {loading ? "Sending…" : "Send Code"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
  },
  heading: {
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.lg,
  },
});