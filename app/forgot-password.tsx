import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordScreen() {
  const { email, setEmail, loading, handleSendCode } = useForgotPassword();

  return (
    <Screen scrollable>
      <Stack gap="xxxl">
        <ScreenHeading
          title="Forgot Password"
          subtitle="Enter your email to receive a reset code"
        />

        <Stack gap="lg">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </Stack>

        <Button fullWidth disabled={loading} onPress={handleSendCode}>
          {loading ? "Sending…" : "Send Code"}
        </Button>
      </Stack>
    </Screen>
  );
}
