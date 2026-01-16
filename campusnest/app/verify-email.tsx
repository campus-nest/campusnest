import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { supabase } from "@/src/lib/supabaseClient";
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
        Alert.alert(
          "Success",
          "Verification email sent! Please check your inbox.",
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to resend verification email");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Icon */}
        <Text style={styles.icon}>📧</Text>

        {/* Title */}
        <H1>Check Your Email</H1>

        {/* Description */}
        <H4 style={styles.description}>
          We&apos;ve sent a verification link to your email address. Please
          check your inbox and click the link to verify your account.
        </H4>

        {/* Email input */}
        <Input
          label="Email address:"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Resend button */}
        <Button
          variant="outline"
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Email"}
        </Button>

        {/* Back to login */}
        <Button variant="primary" onPress={() => router.replace("/login")}>
          Back to Login
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
    gap: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    color: "#ccc",
    lineHeight: 22,
  },
});
