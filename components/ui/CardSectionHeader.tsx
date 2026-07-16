import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface CardSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Uppercase section label + optional "View all"-style action, used inside
// Card sections (profile screen's Account Details / Saved Posts / Saved
// Listings blocks).
export default function CardSectionHeader({ title, actionLabel, onAction }: CardSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md + 2,
  },
  title: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },
  actionBtn: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  actionText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
