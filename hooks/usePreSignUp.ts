import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService, profileService } from "@/src/services";

export function usePreSignUp() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"student" | "landlord" | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleCreateAccount = () => {
    if (!selectedRole) return;
    router.push({ pathname: "/signup", params: { role: selectedRole } });
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) {
      Alert.alert("Error", "Please select a role before continuing with Google.");
      return;
    }
    setGoogleLoading(true);
    try {
      const { success, error: loginError } = await authService.signInWithGoogle();

      if (!success) {
        if (loginError && loginError !== "Sign in was cancelled or failed") {
          Alert.alert("Google Sign-In Failed", loginError);
        }
        return;
      }

      const session = await authService.getSession();
      if (!session?.user) {
        Alert.alert("Error", "No user session found.");
        return;
      }

      const userId = session.user.id;
      const profile = await profileService.getProfileById(userId);

      if (!profile) {
        // Redirect to complete-profile and pre-select the role chosen on signup page
        setTimeout(() => {
          router.replace({
            pathname: "/complete-profile",
            params: { role: selectedRole },
          });
        }, 100);
      } else {
        // Profile exists, go to tabs
        setTimeout(() => router.replace("/(tabs)"), 100);
      }
    } catch (error) {
      console.error("Google sign up error:", error);
      Alert.alert("Error", "An unexpected error occurred during Google sign up.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    selectedRole,
    setSelectedRole,
    googleLoading,
    handleCreateAccount,
    handleGoogleSignUp,
  };
}
