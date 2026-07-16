import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useResetPassword } from "@/hooks/useResetPassword";

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
    <Screen scrollable>
      <Stack gap="lg">
        <ScreenHeading title="New Password" subtitle="Create a new password for your account" />

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
      </Stack>
    </Screen>
  );
}
