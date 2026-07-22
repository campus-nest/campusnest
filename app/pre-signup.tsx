import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Select from "@/components/ui/Select";
import Stack from "@/components/ui/Stack";
import BottomIllustration from "@/components/ui/BottomIllustration";
import { usePreSignUp } from "@/hooks/usePreSignUp";
import { spacing } from "@/src/constants/theme";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const { selectedRole, setSelectedRole, handleCreateAccount } = usePreSignUp();

  return (
    <Screen>
      <Stack gap="lg" align="center" flex={1} style={{ paddingTop: spacing.huge }}>
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

      <BottomIllustration height={200}>
        <PreSignUpBottomHouse fill="none" width="100%" height="100%" />
      </BottomIllustration>
    </Screen>
  );
}
