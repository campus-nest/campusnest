import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, View, Platform } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      const { data: existingProfile, error: profileCheckError } = await supabase
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
            "Missing required profile information. Please complete signup again.",
          );
          setLoading(false);
          return;
        }

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
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex-1 bg-black">
      <StatusBar style="light" />

      <View className="flex-1 justify-center px-8">
        <Text className="text-white text-[32px] font-semibold mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-white text-base font-normal mb-10 text-center opacity-80">
          Login to CampusNest
        </Text>

        <View className="gap-5">
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              aria-labelledby="password"
              className="bg-[#1a1a1a] border-[#333]"
            />
          </View>

          <Button
            onPress={handleLogin}
            disabled={loading}
            className="rounded-full p-4 mt-2"
          >
            <Text>{loading ? "Logging in..." : "Login"}</Text>
          </Button>

          {Platform.OS === "android" && (
            <Button variant="ghost" onPress={() => router.back()}>
              <Text className="text-white">Back to Landing</Text>
            </Button>
          )}
        </View>
      </View>
    </PageContainer>
  );
}
