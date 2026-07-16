import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/src/constants/theme";

type CardVariant = "dark" | "elevated" | "light";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}

export default function Card({ children, variant = "dark", style }: CardProps) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  // Used in profile, saved, users tabs — subtle dark card
  dark: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.subtle,
  },
  // Used in post detail, listing detail — slightly elevated card
  elevated: {
    backgroundColor: colors.background.elevated,
    borderColor: colors.border.default,
  },
  // Used in new_post and edit listing forms — light card on dark background
  light: {
    backgroundColor: colors.light.surface,
    borderColor: colors.light.border,
    borderRadius: radius.xxl,
    padding: spacing.xl,
  },
});
