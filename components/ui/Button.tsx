import { Pressable, StyleSheet, Text } from "react-native";

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
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#fff",
  },
  secondary: {
    backgroundColor: "#333",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
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
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  primaryText: {
    color: "#000",
  },
  secondaryText: {
    color: "#fff",
  },
  outlineText: {
    color: "#fff",
  },
  disabledText: {
    color: "#999",
  },
});
