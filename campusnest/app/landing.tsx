import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LandingPageLogo from "../assets/images/landing_page_bottom_logo.svg";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Logo style={styles.logo} />

        <Text style={styles.title}>CampusNest</Text>
        <Text style={styles.subtitle}>Let&apos;s get Started!</Text>

        <View style={styles.loginBtn}>
          <Button onPress={() => router.push("/login")}>Login</Button>
        </View>

        <Text style={styles.signUpPrompt}>Don&apos;t have an account?</Text>

        <View style={styles.signUpBtn}>
          <Button onPress={() => router.push("/pre-signup")}>Sign Up</Button>
        </View>

        <View style={styles.houseImageContainer}>
          <LandingPageLogo width="100%" height="100%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "70%",
    maxWidth: 500,
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: 176,
  },
  title: {
    position: "absolute",
    top: 295,
    color: "#fff",
    fontSize: 32,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  subtitle: {
    position: "absolute",
    top: 367,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  loginBtn: {
    position: "absolute",
    top: 408,
  },
  signUpPrompt: {
    position: "absolute",
    top: 477,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  signUpBtn: {
    position: "absolute",
    top: 513,
  },
  houseImageContainer: {
    position: "absolute",
    bottom: 25,
    width: "92%",
    maxWidth: 363,
    height: 173,
  },
});