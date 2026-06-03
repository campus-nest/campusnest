import { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, spacing } from "@/src/constants/theme";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  style?: ViewStyle;
}

export default function EmptyState({ title, subtitle, icon, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xxxl,
    paddingBottom: 60,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: colors.text.dim,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
