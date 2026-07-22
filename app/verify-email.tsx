import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import EmojiIcon from "@/components/ui/EmojiIcon";
import CodeInput from "@/components/ui/CodeInput";
import TextLink from "@/components/ui/TextLink";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

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
    <Screen scrollable>
      <Stack gap="xxxl">
        <ScreenHeading
          title="Verify Your Email"
          subtitle="We've sent a 6-digit verification code to your email. Enter it below to verify your account."
          icon={<EmojiIcon>📧</EmojiIcon>}
        />

        <Stack gap="lg">
          <CodeInput value={code} onChangeText={setCode} />

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
          <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
            {loading ? "Verifying…" : "Verify Code"}
          </Button>
          <Button variant="outline" fullWidth onPress={handleResendEmail} disabled={loading}>
            Resend Email
          </Button>
          <TextLink label="Back to Login" onPress={handleBackToLogin} muted />
        </Stack>
      </Stack>
    </Screen>
  );
}
