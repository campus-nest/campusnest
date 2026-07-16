import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useEnterCode } from "@/hooks/useEnterCode";
import { StyleSheet } from "react-native";

export default function EnterCodeScreen() {
  const { email, code, setCode, loading, handleVerifyCode } = useEnterCode();

  return (
    <Screen scrollable>
      <Stack gap="xxxl">
        <ScreenHeading
          title="Enter Code"
          subtitle={`Enter the 6-digit code sent to ${email}`}
        />

        <Stack gap="lg">
          <Input
            label="Verification Code"
            placeholder="123456"
            onChangeText={setCode}
            value={code}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            style={styles.codeInput}
          />
        </Stack>

        <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
          {loading ? "Verifying…" : "Verify Code"}
        </Button>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeInput: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
  },
});
