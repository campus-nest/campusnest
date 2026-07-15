import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import Select from "@/components/ui/Select";
import { usePreSignUp } from "@/hooks/usePreSignUp";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const { selectedRole, setSelectedRole, googleLoading, handleCreateAccount, handleGoogleSignUp } = usePreSignUp();

  return (
    <Screen style={styles.screen}>
      {/* Top content */}
      <View style={styles.top}>
        <Logo style={styles.logoGap} />
        <H1 bold>Select a Role</H1>
        <H4 italic style={styles.subtitle}>Choose how you want to continue</H4>

        <View style={styles.selectWrapper}>
          <Select
            label="Enter Role"
            value={selectedRole}
            placeholder="Choose role"
            options={[
              { label: "Student", value: "student" },
              { label: "Landlord", value: "landlord" },
            ]}
            onChange={setSelectedRole}
          />
        </View>

        <Button fullWidth onPress={handleCreateAccount} disabled={!selectedRole || googleLoading}>
          Create Account
        </Button>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          disabled={!selectedRole || googleLoading}
          onPress={handleGoogleSignUp}
          style={[styles.googleButton, (!selectedRole || googleLoading) && styles.disabledButton]}
        >
          <FontAwesome name="google" size={18} color="#fff" />
          <Text style={styles.googleButtonText}>
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </Text>
        </Pressable>
      </View>

      {/* Bottom illustration */}
      <View style={styles.illustration} pointerEvents="none">
        <PreSignUpBottomHouse fill="none" width="100%" height="100%" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
  },
  top: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    gap: 16,
  },
  logoGap: {
    marginBottom: 4,
  },
  subtitle: {
    color: "#888",
    marginBottom: 8,
  },
  selectWrapper: {
    width: "100%",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 12,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
  },
  disabledButton: {
    opacity: 0.5,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  illustration: {
    height: 140,
    width: "100%",
    marginTop: "auto",
  },
});