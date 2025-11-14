import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LandingTopHome from "@/assets/images/landing_page_top_home.svg";
import LandingPageLogo from "@/assets/images/landing_page_bottom_logo.svg";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LandingTopHome width={96} height={96} fill="none" />
        </View>

        {/* Title */}
        <Text style={styles.title}>CampusNest</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Let&apos;s get Started!</Text>

        {/* Login Button */}
        <Pressable
          style={styles.loginBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        {/* Sign Up Section */}
        <Text style={styles.signUpPrompt}>Don&apos;t have an account?</Text>

        <Pressable
          style={styles.signUpBtn}
          onPress={() => router.push("/pre-signup")}
        >
          <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>

        {/* House Image (SVG) */}
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
  logoContainer: {
    position: "absolute",
    top: 176,
    alignSelf: "center",
  },
  title: {
    position: "absolute",
    top: 295,
    color: "#fff",
    fontSize: 32,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.1,
    alignSelf: "center",
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
    alignSelf: "center",
  },
  loginBtn: {
    position: "absolute",
    top: 408,
    width: 152,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
    alignSelf: "center",
  },
  signUpBtn: {
    position: "absolute",
    top: 513,
    width: 152,
    height: 51,
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  btnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  houseImageContainer: {
    position: "absolute",
    bottom: 25,
    width: "92%",
    maxWidth: 363,
    height: 173,
    alignSelf: "center",
  },
  houseImage: {
    width: "100%",
    height: "100%",
  },
});
