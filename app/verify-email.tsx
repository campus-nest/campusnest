import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { colors, spacing } from "@/src/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function VerifyEmailScreen() {
  const {
    loading,
    email,
    setEmail,
    handleResendEmail,
    handleBackToLogin,
  } = useVerifyEmail();

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      {/* Icon + heading */}
      <View style={styles.heroBlock}>
        <Text style={styles.icon}>📧</Text>
        <H1 bold>Check Your Email</H1>
        <H4 style={styles.description}>
          We&apos;ve sent a verification link to your email. Click the link to verify your account.
        </H4>
      </View>

      {/* Resend form */}
      <View style={styles.form}>
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
        <Button variant="outline" fullWidth onPress={handleResendEmail} disabled={loading}>
          {loading ? "Sending…" : "Resend Email"}
        </Button>
        <Button fullWidth onPress={handleBackToLogin}>
          Back to Login
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
  },
  heroBlock: {
    alignItems: "center",
    gap: spacing.md,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text.secondary,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  form: {
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
});