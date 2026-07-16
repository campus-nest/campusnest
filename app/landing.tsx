import LandingPageLogo from "@/assets/images/landing_page_bottom_logo.svg";
import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/src/constants/theme";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      {/* Top: logo + headlines + buttons */}
      <View style={styles.top}>
        <Logo style={styles.logoGap} />
        <H1 bold>Campus Nest</H1>
        <H3 italic style={styles.tagline}>Let&apos;s get Started!</H3>

        <View style={styles.buttons}>
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
      <View style={styles.illustration} pointerEvents="none">
        <LandingPageLogo width="100%" height="100%" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.xxl,
  },
  top: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    gap: spacing.md,
  },
  logoGap: {
    marginBottom: spacing.xs,
  },
  tagline: {
    marginBottom: spacing.sm,
  },
  buttons: {
    width: "100%",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  illustration: {
    height: 180,
    width: "100%",
    marginBottom: 0,
  },
});