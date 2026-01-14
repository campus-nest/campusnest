import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { getSupabase } from "@/src/lib/supabaseClient";
import { authService, profileService } from "@/src/services";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text
} from "react-native";

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
        setLoading(false);
        return;
      }

      const session = await authService.getSession();

      if (!session?.user) {
        Alert.alert("Error", "No user session found.");
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Check if profile exists
      let profile = await profileService.getProfileById(userId);

      if (!profile) {
        const fullName = session.user.user_metadata?.full_name;
        const role = session.user.user_metadata?.role;

        if (!fullName || !role) {
          Alert.alert(
            "Error",
            "Missing required profile information. Please complete signup again.",
          );
          setLoading(false);
          return;
        }

        // Create profile using direct Supabase call (since service doesn't have insert method yet)
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          full_name: fullName,
          role: role,
        });

        if (insertError) {
          Alert.alert("Error", "Failed to create user profile.");
          setLoading(false);
          return;
        }

        profile = await profileService.getProfileById(userId);
      }

      if (!profile) {
        Alert.alert("Error", "Failed to fetch user profile.");
        setLoading(false);
        return;
      }

      if (profile.role === "student" || profile.role === "landlord") {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Unknown user role.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
        <H1 bold>Welcome Back</H1>
        <H3>Login to CampusNest</H3>

        <Input 
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address" />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          />

          <Pressable
            onPress={() => router.push("/forgot-password")}
            style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

        <Button fullWidth onPress={handleLogin}>{loading ? "Logging in..." : "Login"}</Button>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Landing</Text>
        </Pressable>
    </Screen >
  );
}

const styles = StyleSheet.create({
  backText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
});
