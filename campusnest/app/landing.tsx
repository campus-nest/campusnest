import LandingPageLogo from "@/assets/images/landing_page_bottom_logo.svg";
import Button from "@/components/ui/Button";
import { H1, H3 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Logo />

      <H1>Campus Nest</H1>
      <H3 italic>Let&apos;s get Started!</H3>

      <View style={{alignSelf: "center"}}>
        <Button onPress={() => router.push("/login")}>Login</Button>
      </View>
      <H3 italic>Don&apos;t have an account?</H3>
      <View style={{alignSelf: "center"}}>
        <Button onPress={() => router.push("/pre-signup")}>Sign Up</Button>
      </View>
      <View style={styles.houseImageContainer}>
        <LandingPageLogo width="100%" height="100%" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  houseImageContainer: {
    position:"absolute",
    bottom:25,
    alignSelf:"center",
    height: 150,
    width: "92%",
    maxWidth: 700,
  },
});