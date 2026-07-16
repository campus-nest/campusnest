import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "@/src/constants/theme";

type IconCircleVariant = "subtle" | "elevated" | "onWhite" | "disabled";

const variantStyles: Record<IconCircleVariant, ViewStyle> = {
  subtle: {
    backgroundColor: colors.border.dim,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  elevated: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.dim,
  },
  onWhite: {
    backgroundColor: colors.white,
  },
  disabled: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.dim,
  },
};

interface IconCircleProps {
  children: ReactNode;
  size?: number;
  radius?: number;
  variant?: IconCircleVariant;
  style?: ViewStyle;
}

export default function IconCircle({
  children,
  size = 40,
  radius,
  variant = "subtle",
  style,
}: IconCircleProps) {
  return (
    <View
      style={[
        styles.base,
        variantStyles[variant],
        { width: size, height: size, borderRadius: radius ?? size / 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
