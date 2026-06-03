import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  label?: string;
  value: T | null;
  placeholder?: string;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

export default function Select<T extends string>({
  label,
  value,
  placeholder = "Select option",
  options,
  onChange,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.trigger, open && styles.triggerOpen]}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {selectedLabel}
        </Text>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>›</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {options.map((option, i) => (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                i < options.length - 1 && styles.optionBorder,
                option.value === value && styles.optionActive,
              ]}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, option.value === value && styles.optionTextActive]}>
                {option.label}
              </Text>
              {option.value === value && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },
  label: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  triggerOpen: {
    borderColor: colors.text.dim,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerText: {
    color: colors.white,
    fontSize: typography.size.lg,
  },
  placeholderText: {
    color: colors.text.faint,
  },
  chevron: {
    color: colors.text.faint,
    fontSize: typography.size.xxl,
    lineHeight: 20,
    transform: [{ rotate: "90deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "270deg" }],
  },
  dropdown: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.text.dim,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  optionActive: {
    backgroundColor: colors.border.dim,
  },
  optionText: {
    color: colors.text.body,
    fontSize: typography.size.lg,
  },
  optionTextActive: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
  },
  checkmark: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
});