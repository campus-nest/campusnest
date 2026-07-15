import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useLogin } from "@/hooks/useLogin";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    googleLoading,
    handleLogin,
    handleGoogleLogin,
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
        <Button disabled={loading || googleLoading} fullWidth onPress={handleLogin}>
          {loading ? "Logging in…" : "Login"}
        </Button>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          disabled={loading || googleLoading}
          onPress={handleGoogleLogin}
          style={[styles.googleButton, (loading || googleLoading) && styles.disabledButton]}
        >
          <FontAwesome name="google" size={18} color="#fff" />
          <Text style={styles.googleButtonText}>
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </Text>
        </Pressable>

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
    width: "100%",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 12,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
  },
  disabledButton: {
    opacity: 0.5,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.5,
    marginTop: 8,
  },
});