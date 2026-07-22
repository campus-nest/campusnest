import Button from "@/components/ui/Button";
import CodeInput from "@/components/ui/CodeInput";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import { useEnterCode } from "@/hooks/useEnterCode";

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
          <CodeInput value={code} onChangeText={setCode} />
        </Stack>

        <Button fullWidth onPress={handleVerifyCode} disabled={loading}>
          {loading ? "Verifying…" : "Verify Code"}
        </Button>
      </Stack>
    </Screen>
  );
}
