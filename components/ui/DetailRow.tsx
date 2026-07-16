import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

interface DetailRowProps {
  label: string;
  value?: string | null;
  last?: boolean;
}

export default function DetailRow({ label, value, last }: DetailRowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.faint,
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    color: colors.text.faint,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  value: {
    color: colors.text.value,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    maxWidth: "58%",
    textAlign: "right",
  },
});
