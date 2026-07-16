import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing } from "@/src/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  variant?: "dark" | "light";
}

export default function Input({
  label,
  containerStyle,
  style,
  labelStyle,
  variant = "dark",
  ...props
}: InputProps) {
  const isLight = variant === "light";
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight && styles.labelLight, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, isLight && styles.inputLight, style]}
        placeholderTextColor={isLight ? colors.light.placeholder : colors.text.faint}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  labelLight: {
    color: colors.background.elevated,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    color: colors.text.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border.strong,
    letterSpacing: 0,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  inputLight: {
    backgroundColor: colors.white,
    borderColor: colors.light.border,
    color: colors.black,
  },
});
