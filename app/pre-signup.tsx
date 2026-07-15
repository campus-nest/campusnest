import React from "react";
import Button from "@/components/ui/Button";
import { H1, H4 } from "@/components/ui/Headings";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import Select from "@/components/ui/Select";
import { usePreSignUp } from "@/hooks/usePreSignUp";
import { View } from "react-native";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const { selectedRole, setSelectedRole, handleCreateAccount } = usePreSignUp();

  return (
    <Screen>
      {/* Top content */}
      <View className="flex-1 items-center pt-12 gap-4">
        <Logo className="mb-1" style={{ marginBottom: 4 }} />
        <H1 bold>Select a Role</H1>
        <H4 italic className="mb-2" style={{ color: "#888", marginBottom: 8 }}>Choose how you want to continue</H4>

        <View className="w-full">
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
      <View className="h-[200px] w-full" pointerEvents="none">
        <PreSignUpBottomHouse fill="none" width="100%" height="100%" />
      </View>
    </Screen>
  );
}