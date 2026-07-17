import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { StyleSheet, Text, View } from "react-native";

export default function VerifyEmailScreen() {
  const {
    loading,
    email,
    setEmail,
    code,
    setCode,
    handleVerifyCode,
    handleResendEmail,
    handleBackToLogin,
  } = useVerifyEmail();

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      {/* Icon + heading */}
      <View style={styles.heroBlock}>
        <Text style={styles.icon}>📧</Text>
        <H1 bold>Verify Your Email</H1>
        <H4 style={styles.description}>
          We&apos;ve sent a 6-digit verification code to your email. Enter it below to verify your account.
        </H4>
      </View>

      <View style={styles.form}>
        <Input
          label="Verification Code"
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          style={styles.codeInput}
        />
        
        <Input
          label="Email address"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.actions}>
        <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
          {loading ? "Verifying…" : "Verify Code"}
        </Button>
        <Button variant="outline" fullWidth onPress={handleResendEmail} disabled={loading}>
          Resend Email
        </Button>
        <Button variant="ghost" fullWidth onPress={handleBackToLogin}>
          Back to Login
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 32,
  },
  heroBlock: {
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 64,
    marginBottom: 4,
  },
  description: {
    color: "#888",
    lineHeight: 20,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  codeInput: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
});