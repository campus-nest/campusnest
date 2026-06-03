import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService, profileService } from "@/src/services";

export function useLogin() {
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
      const { success, error: loginError } = await authService.signIn(
        email.trim(),
        password
      );

      if (!success || loginError) {
        Alert.alert("Login Failed", loginError || "An error occurred during sign in.");
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

        const { success: createSuccess, error: insertError } =
          await profileService.createProfile(userId, {
            full_name: fullName,
            role,
            email: session.user.email || "",
          });

        if (!createSuccess || insertError) {
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

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleBack = () => {
    router.back();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
    handleBack,
  };
}
