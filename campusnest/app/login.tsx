import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useLogin } from "@/hooks/useLogin";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <Screen scrollable contentContainerStyle={styles.content}>
      {/* Heading block */}
      <View style={styles.heading}>
        <H1 bold>Welcome Back</H1>
        <H3 style={styles.subtitle}>Login to CampusNest</H3>
      </View>

      {/* Form */}
      <View style={styles.form}>
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
        <Pressable
          onPress={handleForgotPassword}
          style={styles.forgotRow}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button disabled={loading} fullWidth onPress={handleLogin}>
          {loading ? "Logging in…" : "Login"}
        </Button>
        <Pressable onPress={handleBack}>
          <Text style={styles.backText}>Back to Landing</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 32,
  },
  heading: {
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    color: "#888",
  },
  form: {
    gap: 16,
  },
  forgotRow: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
  actions: {
    gap: 16,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.5,
  },
});