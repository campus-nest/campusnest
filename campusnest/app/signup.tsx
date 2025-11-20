import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, ScrollView, View, Platform } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!role) {
      Alert.alert("Error", "Missing role. Please go back and select a role.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: "https://campusnest.uofacs.ca/",
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) {
        Alert.alert("Sign Up Failed", signUpError.message);
        return;
      }

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/verify-email") }],
      );
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="bg-black">
      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" />

        <View className="flex-1 justify-center px-8 py-[60px]">
          <Text className="text-white text-[32px] font-semibold mb-2 text-center">
            Create Account
          </Text>
          <Text className="text-white text-base font-normal mb-10 text-center opacity-80">
            Join CampusNest today
          </Text>

          <View className="gap-5">
            <View className="gap-2">
              <Label nativeID="fullName" className="text-white text-sm font-medium">
                Full Name
              </Label>
              <Input
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                aria-labelledby="fullName"
                className="bg-[#1a1a1a] border-[#333]"
              />
            </View>

            <View className="gap-2">
              <Label nativeID="email" className="text-white text-sm font-medium">
                Email
              </Label>
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                aria-labelledby="email"
                className="bg-[#1a1a1a] border-[#333]"
              />
            </View>

            <View className="gap-2">
              <Label nativeID="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <Input
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                aria-labelledby="password"
                className="bg-[#1a1a1a] border-[#333]"
              />
            </View>

            <View className="gap-2">
              <Label nativeID="confirmPassword" className="text-white text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                aria-labelledby="confirmPassword"
                className="bg-[#1a1a1a] border-[#333]"
              />
            </View>

            <Button
              onPress={handleSignUp}
              disabled={loading}
              className="rounded-full p-4 mt-2"
            >
              <Text>{loading ? "Creating Account..." : "Sign Up"}</Text>
            </Button>

            {Platform.OS === "android" && (
              <Button variant="ghost" onPress={() => router.back()}>
                <Text className="text-white">Back to Landing</Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
}
