import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

interface TabPageHeaderProps {
  title: string;
  right?: ReactNode;
  inline?: boolean;
}

// Big page title + optional right-side slot, used at the top of each tab
// root screen (Saved, Student Posts, ...).
export default function TabPageHeader({ title, right, inline }: TabPageHeaderProps) {
  return (
    <View style={[styles.row, inline ? styles.inline : styles.spread]}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  spread: {
    justifyContent: "space-between",
  },
  inline: {
    gap: spacing.sm + 2,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.1,
  },
});
