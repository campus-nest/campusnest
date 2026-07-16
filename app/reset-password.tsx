import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useResetPassword } from "@/hooks/useResetPassword";
import { spacing } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default function ResetPasswordScreen() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleUpdatePassword,
  } = useResetPassword();

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <H1 bold>New Password</H1>
      <H4>Create a new password for your account</H4>

      <Input
        label="New Password"
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button fullWidth onPress={handleUpdatePassword} disabled={loading}>
        {loading ? "Updating…" : "Update Password"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
});