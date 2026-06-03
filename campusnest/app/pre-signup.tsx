import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import Select from "@/components/ui/Select";
import { colors, spacing } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"student" | "landlord" | null>(null);

  const handleCreateAccount = () => {
    if (!selectedRole) return;
    router.push({ pathname: "/signup", params: { role: selectedRole } });
  };

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

        <Button fullWidth onPress={handleCreateAccount} disabled={!selectedRole}>
          Create Account
        </Button>
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
    paddingHorizontal: spacing.xxl,
  },
  top: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    gap: spacing.lg,
  },
  logoGap: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  selectWrapper: {
    width: "100%",
  },
  illustration: {
    height: 200,
    width: "100%",
  },
});