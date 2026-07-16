import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Select from "@/components/ui/Select";
import Stack from "@/components/ui/Stack";
import { usePreSignUp } from "@/hooks/usePreSignUp";
import { StyleSheet, View } from "react-native";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const { selectedRole, setSelectedRole, handleCreateAccount } = usePreSignUp();

  return (
    <Screen>
      <Stack gap="lg" align="center" flex={1} style={styles.top}>
        <Logo />
        <ScreenHeading
          title="Select a Role"
          subtitle="Choose how you want to continue"
          italic
        />

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

        <Button fullWidth onPress={handleCreateAccount} disabled={!selectedRole}>
          Create Account
        </Button>
      </Stack>

      {/* Bottom illustration */}
      <View style={styles.illustration} pointerEvents="none">
        <PreSignUpBottomHouse fill="none" width="100%" height="100%" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingTop: 48,
  },
  illustration: {
    height: 200,
    width: "100%",
  },
});
