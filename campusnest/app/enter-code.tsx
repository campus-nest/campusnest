import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useEnterCode } from "@/hooks/useEnterCode";
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
    gap: 32,
  },
  heading: {
    alignItems: "center",
    gap: 8,
  },
  subtitle: {
    color: "#888",
    paddingHorizontal: 16,
    lineHeight: 20,
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
});