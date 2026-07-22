import { Pressable, StyleSheet, Text } from "react-native";
import { colors, typography } from "@/src/constants/theme";

interface TextLinkProps {
  label: string;
  onPress: () => void;
  align?: "end";
  muted?: boolean;
}

// Low-emphasis tap target used below auth forms (e.g. "Forgot Password?",
// "Back to Landing") instead of a full Button.
export default function TextLink({ label, onPress, align, muted }: TextLinkProps) {
  return (
    <Pressable onPress={onPress} style={align === "end" ? styles.alignEnd : undefined}>
      <Text style={[styles.text, muted && styles.muted]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alignEnd: {
    alignSelf: "flex-end",
  },
  text: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    opacity: 0.7,
  },
  muted: {
    opacity: 0.5,
    fontWeight: typography.weight.regular,
    textAlign: "center",
  },
});
