import { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

interface SectionProps {
  title?: string;
  children: ReactNode;
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export default function Section({ title, children, variant = "dark", style }: SectionProps) {
  const isLight = variant === "light";
  return (
    <View style={[styles.section, style]}>
      {title && (
        <Text style={[styles.title, isLight && styles.titleLight]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

interface DividerProps {
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export function Divider({ variant = "dark", style }: DividerProps) {
  const isLight = variant === "light";
  return (
    <View
      style={[
        styles.divider,
        isLight ? styles.dividerLight : styles.dividerDark,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  titleLight: {
    color: colors.background.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  dividerDark: {
    backgroundColor: colors.border.strong,
  },
  dividerLight: {
    backgroundColor: colors.light.divider,
  },
});
