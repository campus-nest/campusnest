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
}

export default function Input({
  label,
  containerStyle,
  style,
  labelStyle,
  ...props
}: InputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.faint}
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
});
