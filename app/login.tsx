import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useLogin } from "@/hooks/useLogin";
import { colors, typography } from "@/src/constants/theme";
import { Pressable, StyleSheet, Text } from "react-native";

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
          <Pressable onPress={handleForgotPassword} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </Stack>

        <Stack gap="lg" align="center">
          <Button disabled={loading} fullWidth onPress={handleLogin}>
            {loading ? "Logging in…" : "Login"}
          </Button>
          <Pressable onPress={handleBack}>
            <Text style={styles.backText}>Back to Landing</Text>
          </Pressable>
        </Stack>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  forgotRow: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    opacity: 0.7,
  },
  backText: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    textAlign: "center",
    opacity: 0.5,
  },
});
