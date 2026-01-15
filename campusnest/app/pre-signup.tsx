import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import BackButton from "@/components/ui/BackButton";
import Select from "@/components/ui/Select";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "student" | "landlord" | null
  >(null);

  const handleCreateAccount = () => {
    if (!selectedRole) return;

    router.push({
      pathname: "/signup",
      params: { role: selectedRole },
    });
  };

  return (
    <Screen>
      <BackButton />
      <Logo />
      <H1>Select a Role</H1>
      <H4 italic>Choose how you want to continue</H4>

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

      <Button
        fullWidth
        onPress={handleCreateAccount}
        disabled={!selectedRole}
      >
        Create Account
      </Button>

      <View style={styles.bottomHouseContainer}>
        <PreSignUpBottomHouse fill="none" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bottomHouseContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
