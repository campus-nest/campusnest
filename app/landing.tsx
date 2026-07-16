import LandingPageLogo from "@/assets/images/landing_page_bottom_logo.svg";
import Button from "@/components/ui/Button";
import { H3 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import BottomIllustration from "@/components/ui/BottomIllustration";
import { useRouter } from "expo-router";
import { spacing } from "@/src/constants/theme";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Screen>
      {/* Top: logo + headlines + buttons */}
      <Stack gap="md" align="center" flex={1} style={{ paddingTop: spacing.huge }}>
        <Logo />
        <ScreenHeading title="Campus Nest" subtitle="Let's get Started!" italic />

        <Stack gap="md" align="center" style={{ width: "100%", marginTop: spacing.sm }}>
          <Button fullWidth onPress={() => router.push("/login")}>
            Login
          </Button>
          <H3 italic>Don&apos;t have an account?</H3>
          <Button fullWidth onPress={() => router.push("/pre-signup")}>
            Sign Up
          </Button>
        </Stack>
      </Stack>

      <BottomIllustration height={180}>
        <LandingPageLogo width="100%" height="100%" />
      </BottomIllustration>
    </Screen>
  );
}
