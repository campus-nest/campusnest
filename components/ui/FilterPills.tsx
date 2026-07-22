import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

export interface FilterOption<T extends string> {
  label: string;
  value: T;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  customPrependPill?: React.ReactNode;
}

export default function FilterPills<T extends string>({
  options,
  value,
  onChange,
  customPrependPill,
}: FilterPillsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {customPrependPill}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const pillStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.screen,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  pillActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  text: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
  textActive: {
    color: colors.black,
  },
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  ...pillStyles,
});
