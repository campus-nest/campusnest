import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import TextLink from "@/components/ui/TextLink";
import { useLogin } from "@/hooks/useLogin";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
    handleBack,
  } = useLogin();

  return (
    <Screen scrollable>
      <Stack gap="xxxl">
        <ScreenHeading title="Welcome Back" subtitle="Login to CampusNest" />

        <Stack gap="lg">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextLink label="Forgot Password?" onPress={handleForgotPassword} align="end" />
        </Stack>

        <Stack gap="lg" align="center">
          <Button disabled={loading} fullWidth onPress={handleLogin}>
            {loading ? "Logging in…" : "Login"}
          </Button>
          <TextLink label="Back to Landing" onPress={handleBack} muted />
        </Stack>
      </Stack>
    </Screen>
  );
}
