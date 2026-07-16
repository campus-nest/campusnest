import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { spacing } from "@/src/constants/theme";
import { StyleSheet, Text } from "react-native";

export default function VerifyEmailScreen() {
  const {
    loading,
    email,
    setEmail,
    handleResendEmail,
    handleBackToLogin,
  } = useVerifyEmail();

  return (
    <Screen scrollable>
      <Stack gap="xxxl">
        <ScreenHeading
          title="Check Your Email"
          subtitle="We've sent a verification link to your email. Click the link to verify your account."
          icon={<Text style={styles.icon}>📧</Text>}
        />

        <Stack gap="lg">
          <Input
            label="Email address"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Stack>

        <Stack gap="md" align="center">
          <Button variant="outline" fullWidth onPress={handleResendEmail} disabled={loading}>
            {loading ? "Sending…" : "Resend Email"}
          </Button>
          <Button fullWidth onPress={handleBackToLogin}>
            Back to Login
          </Button>
        </Stack>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 64,
    marginBottom: spacing.xs,
  },
});
