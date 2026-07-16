import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import EmojiIcon from "@/components/ui/EmojiIcon";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

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
          icon={<EmojiIcon>📧</EmojiIcon>}
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
