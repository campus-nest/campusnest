import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  offsetTop?: number;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({ title, subtitle, icon, offsetTop, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, offsetTop !== undefined && { paddingTop: offsetTop }, style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Pressable style={styles.action} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
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
    paddingBottom: spacing.massive,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
  },
  subtitle: {
    color: colors.text.dim,
    fontSize: typography.size.md,
    textAlign: "center",
    lineHeight: 20,
  },
  action: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  actionText: {
    color: colors.black,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
