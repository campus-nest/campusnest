import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "@/src/constants/theme";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  onPress,
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.base,
        styles[variant],
        styles[`${size}Size`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.baseText,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.border.strong,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.white,
  },
  disabled: {
    opacity: 0.5,
  },
  smallSize: {
    width: 120,
    height: 40,
  },
  mediumSize: {
    width: 152,
    height: 48,
  },
  largeSize: {
    width: 200,
    height: 56,
  },
  fullWidth: {
    width: "100%",
  },
  baseText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  primaryText: {
    color: colors.black,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.white,
  },
  disabledText: {
    color: colors.text.readable,
  },
});
