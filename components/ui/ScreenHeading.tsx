import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { H1, H4 } from "./Headings";
import { colors, spacing } from "@/src/constants/theme";

interface ScreenHeadingProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  italic?: boolean;
  align?: "center" | "left";
  style?: ViewStyle;
}

// Title + optional subtitle block, used by every auth/onboarding/form screen
// instead of each one redefining its own "heading" wrapper styles.
export default function ScreenHeading({
  title,
  subtitle,
  icon,
  italic,
  align = "center",
  style,
}: ScreenHeadingProps) {
  const left = align === "left";
  return (
    <View style={[styles.container, left && styles.containerLeft, style]}>
      {icon}
      <H1 bold style={left ? styles.textLeft : undefined}>{title}</H1>
      {subtitle && (
        <H4
          italic={italic}
          style={StyleSheet.flatten([styles.subtitle, left && styles.textLeft])}
        >
          {subtitle}
        </H4>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
  },
  containerLeft: {
    alignItems: "flex-start",
  },
  textLeft: {
    textAlign: "left",
    paddingHorizontal: 0,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
});
