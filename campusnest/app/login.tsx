import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
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
      const { error: loginError } = await supabase.auth.signInWithPassword({
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        Alert.alert("Login Failed", loginError.message);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        Alert.alert("Error", "No user session found.");
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data: existingProfile, error: profileCheckError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

      if (profileCheckError) {
        Alert.alert("Error", "Failed to check user profile.");
        setLoading(false);
        return;
      }

      if (!existingProfile) {
        const fullName = session.user.user_metadata?.full_name;
        const role = session.user.user_metadata?.role;

        if (!fullName || !role) {
          Alert.alert(
            "Error",
            "Missing required profile information. Please complete signup again."
          );
          setLoading(false);
          return;
        }

        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: fullName,
            role: role,
          });

        if (insertError) {
          Alert.alert("Error", "Failed to create user profile.");
          setLoading(false);
          return;
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
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
    <PageContainer style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to CampusNest</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              onPress={() => router.push("/forgot-password")}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>

          {Platform.OS === "android" && (
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Landing</Text>
            </Pressable>
          )}
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 40,
    textAlign: "center",
    opacity: 0.8,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    letterSpacing: 0,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
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
