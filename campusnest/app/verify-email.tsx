import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { supabase } from "@/src/lib/supabaseClient";
import { colors, spacing } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to resend verification email");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      {/* Icon + heading */}
      <View style={styles.heroBlock}>
        <Text style={styles.icon}>📧</Text>
        <H1 bold>Check Your Email</H1>
        <H4 style={styles.description}>
          We&apos;ve sent a verification link to your email. Click the link to verify your account.
        </H4>
      </View>

      {/* Resend form */}
      <View style={styles.form}>
        <Input
          label="Email address"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.actions}>
        <Button variant="outline" fullWidth onPress={handleResendEmail} disabled={loading}>
          {loading ? "Sending…" : "Resend Email"}
        </Button>
        <Button fullWidth onPress={() => router.replace("/login")}>
          Back to Login
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
  },
  heroBlock: {
    alignItems: "center",
    gap: spacing.md,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text.secondary,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  form: {
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
});