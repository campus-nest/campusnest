import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { H1, H4 } from "./Headings";
import { colors, spacing } from "@/src/constants/theme";

interface ScreenHeadingProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  italic?: boolean;
  style?: ViewStyle;
}

// Centered title + optional subtitle block, used by every auth/onboarding
// screen instead of each one redefining its own "heading" wrapper styles.
export default function ScreenHeading({ title, subtitle, icon, italic, style }: ScreenHeadingProps) {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <H1 bold>{title}</H1>
      {subtitle && (
        <H4 italic={italic} style={styles.subtitle}>
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
  subtitle: {
    color: colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
});
