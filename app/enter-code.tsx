import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useEnterCode } from "@/hooks/useEnterCode";
import { colors, spacing } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";

export default function EnterCodeScreen() {
  const { email, code, setCode, loading, handleVerifyCode } = useEnterCode();

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <H1 bold>Enter Code</H1>
        <H4 style={styles.subtitle}>Enter the 6-digit code sent to {email}</H4>
      </View>

      <View style={styles.form}>
        <Input
          label="Verification Code"
          placeholder="123456"
          onChangeText={setCode}
          value={code}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          style={styles.codeInput}
        />
      </View>

      <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
        {loading ? "Verifying…" : "Verify Code"}
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
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  form: {
    gap: spacing.lg,
  },
  codeInput: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
  },
});