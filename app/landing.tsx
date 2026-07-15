import LandingPageLogo from "@/assets/images/landing_page_bottom_logo.svg";
import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Screen>
      {/* Top: logo + headlines + buttons */}
      <View className="flex-1 items-center pt-12 gap-3">
        <Logo className="mb-1" style={{ marginBottom: 4 }} />
        <H1 bold>Campus Nest</H1>
        <H3 italic style={{ marginBottom: 8 }}>Let&apos;s get Started!</H3>

        <View className="w-full items-center gap-3 mt-2">
          <Button fullWidth onPress={() => router.push("/login")}>
            Login
          </Button>
          <H3 italic>Don&apos;t have an account?</H3>
          <Button fullWidth onPress={() => router.push("/pre-signup")}>
            Sign Up
          </Button>
        </View>
      </View>

      {/* Bottom: illustration pinned to the bottom */}
      <View className="h-[180px] w-full mb-0" pointerEvents="none">
        <LandingPageLogo width="100%" height="100%" />
      </View>
    </Screen>
  );
}