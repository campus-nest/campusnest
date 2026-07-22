import Input from "@/components/ui/Input";
import { typography } from "@/src/constants/theme";

interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
}

// Large centered digit-entry field used for OTP/verification codes.
export default function CodeInput({ value, onChangeText, length = 6 }: CodeInputProps) {
  return (
    <Input
      label="Verification Code"
      placeholder="123456"
      value={value}
      onChangeText={onChangeText}
      keyboardType="number-pad"
      maxLength={length}
      textAlign="center"
      style={{
        fontSize: typography.size.display,
        fontWeight: typography.weight.bold,
        letterSpacing: typography.size.sm,
        textAlign: "center",
      }}
    />
  );
}
