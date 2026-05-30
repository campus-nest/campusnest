import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { getSupabase } from "@/src/lib/supabaseClient";
import { authService, profileService } from "@/src/services";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) {
        Alert.alert("Login Failed", loginError.message);
        return;
      }
      const session = await authService.getSession();
      if (!session?.user) {
        Alert.alert("Error", "No user session found.");
        return;
      }
      const userId = session.user.id;
      let profile = await profileService.getProfileById(userId);
      if (!profile) {
        const fullName = session.user.user_metadata?.full_name;
        const role = session.user.user_metadata?.role;
        if (!fullName || !role) {
          Alert.alert("Error", "Missing required profile information. Please complete signup again.");
          return;
        }
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          full_name: fullName,
          role,
        });
        if (insertError) {
          Alert.alert("Error", "Failed to create user profile.");
          return;
        }
        profile = await profileService.getProfileById(userId);
      }
      if (!profile) {
        Alert.alert("Error", "Failed to fetch user profile.");
        return;
      }
      if (profile.role === "student" || profile.role === "landlord") {
        setTimeout(() => router.replace("/(tabs)"), 100);
      } else {
        Alert.alert("Error", "Unknown user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          onPress={() => router.push("/forgot-password")}
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
        <Pressable onPress={() => router.back()}>
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