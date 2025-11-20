import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import LandingTopHome from "../assets/images/landing_page_top_home.svg";
import LandingPageLogo from "../assets/images/landing_page_bottom_logo.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <StatusBar style="light" />
      <View className="w-[70%] max-w-[500px] h-full bg-black items-center relative">
        {/* Logo */}
        <View className="absolute top-44 self-center">
          <LandingTopHome width={96} height={96} fill="none" />
        </View>

        {/* Title */}
        <Text className="absolute top-[295px] text-white text-[32px] font-medium text-center self-center">
          CampusNest
        </Text>

        {/* Subtitle */}
        <Text className="absolute top-[367px] text-white text-sm font-medium italic text-center self-center">
          Let's get Started!
        </Text>

        {/* Login Button */}
        <Button
          onPress={() => router.push("/login")}
          className="absolute top-[408px] w-[152px] h-12 rounded-full self-center"
        >
          <Text>Login</Text>
        </Button>

        {/* Sign Up Section */}
        <Text className="absolute top-[477px] text-white text-sm font-medium italic text-center self-center">
          Don't have an account?
        </Text>

        {/* Sign Up Button */}
        <Button
          onPress={() => router.push("/pre-signup")}
          className="absolute top-[513px] w-[152px] h-[51px] rounded-full self-center"
        >
          <Text>Sign Up</Text>
        </Button>

        {/* House Image (SVG) */}
        <View className="absolute bottom-6 w-[92%] max-w-[363px] h-[173px] self-center">
          <LandingPageLogo width="100%" height="100%" />
        </View>
      </View>
    </View>
  );
}
