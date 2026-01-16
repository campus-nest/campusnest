import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { supabase } from "@/src/lib/supabaseClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";

export default function EnterCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code.length === 6) {
      Keyboard.dismiss();
    }
  }, [code]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    if (code.trim().length !== 6) {
      Alert.alert("Error", "Verification code must be 6 digits");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email address missing. Please try again.");
      router.back();
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "recovery",
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/reset-password");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <H1 bold>Enter Code</H1>
      <H4>Enter the 6-digit code sent to {email}</H4>

      <Input
        label="Verification Code"
        placeholder="Enter your verfication code here; Ex: 123456"
        onChangeText={setCode}
        value={code}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </Screen>
  );
}
