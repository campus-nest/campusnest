import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  const { email, setEmail, loading, handleSendCode } = useForgotPassword();

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
    gap: 32,
  },
  heading: {
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    color: "#888",
  },
  form: {
    gap: 16,
  },
});