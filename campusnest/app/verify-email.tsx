import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <PageContainer>
      <StatusBar style="light" />
      <View className="flex-1 bg-black justify-center items-center p-5">
        <View className="w-full max-w-[400px] items-center">
          {/* Icon/Emoji */}
          <Text className="text-[80px] mb-6">📧</Text>

          {/* Title */}
          <Text className="text-[28px] font-bold text-white mb-4 text-center">
            Check Your Email
          </Text>

          {/* Description */}
          <Text className="text-base text-[#ccc] text-center mb-8 leading-6">
            We've sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </Text>

          {/* Resend Section */}
          <View className="mb-8 items-center">
            <Text className="text-sm text-[#999] mb-3">
              Didn't receive the email?
            </Text>
            <Button
              onPress={handleResendEmail}
              disabled={loading}
              variant="outline"
              className="px-6 py-3"
            >
              <Text>{loading ? "Sending..." : "Resend Email"}</Text>
            </Button>
          </View>

          {/* Input for resend */}
          <View className="w-full mb-6">
            <Label nativeID="email" className="text-[#ccc] text-sm mb-2">
              Email address:
            </Label>
            <Input
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              aria-labelledby="email"
              className="bg-[#1a1a1a] border-[#333]"
            />
          </View>

          {/* Back to Login */}
          <Button
            onPress={() => router.replace("/login")}
            variant="link"
          >
            <Text className="text-white underline">Back to Login</Text>
          </Button>
        </View>
      </View>
    </PageContainer>
  );
}
