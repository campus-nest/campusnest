import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useLogin } from "@/hooks/useLogin";
import { Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
    handleBack,
  } = useLogin();

  return (
    <Screen scrollable contentContainerClassName="gap-8">
      {/* Heading block */}
      <View className="items-center gap-1.5">
        <H1 bold>Welcome Back</H1>
        <H3 style={{ color: "#888" }}>Login to CampusNest</H3>
      </View>

      {/* Form */}
      <View className="gap-4">
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
          onPress={handleForgotPassword}
          className="self-end"
        >
          <Text className="text-white text-[14px] font-medium opacity-70">Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <View className="gap-4 items-center">
        <Button disabled={loading} fullWidth onPress={handleLogin}>
          {loading ? "Logging in…" : "Login"}
        </Button>
        <Pressable onPress={handleBack}>
          <Text className="text-white text-[14px] text-center opacity-50">Back to Landing</Text>
        </Pressable>
      </View>
    </Screen>
  );
}