import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  variant?: "default" | "light";
}

export default function Chip({ label, selected = false, onPress, variant = "default" }: ChipProps) {
  const isLight = variant === "light";
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        isLight ? styles.chipLight : styles.chipDefault,
        selected && (isLight ? styles.chipLightSelected : styles.chipSelected),
      ]}
    >
      <Text
        style={[
          styles.chipText,
          isLight ? styles.chipTextLight : styles.chipTextDefault,
          selected && (isLight ? styles.chipTextLightSelected : styles.chipTextSelected),
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  variant?: "default" | "light";
}

export function ChipGroup({ options, selected, onToggle, variant = "default" }: ChipGroupProps) {
  return (
    <View style={styles.chipGroup}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option.charAt(0).toUpperCase() + option.slice(1)}
          selected={selected.includes(option)}
          onPress={() => onToggle(option)}
          variant={variant}
        />
      ))}
    </View>
  );
}

interface ToggleChipGroupProps {
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (value: string) => void;
  variant?: "default" | "light";
}

export function ToggleChipGroup({ options, value, onChange, variant = "light" }: ToggleChipGroupProps) {
  return (
    <View style={styles.toggleGroup}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[
            styles.toggleChip,
            variant === "light" && styles.toggleChipLight,
            value === option.value && styles.toggleChipActive,
          ]}
        >
          <Text
            style={[
              styles.toggleChipText,
              variant === "light" && styles.toggleChipTextLight,
              value === option.value && styles.toggleChipTextActive,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: colors.background.elevated,
    borderColor: colors.border.strong,
  },
  chipLight: {
    backgroundColor: colors.white,
    borderColor: "#bbb",
  },
  chipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  chipLightSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  chipTextDefault: {
    color: colors.text.primary,
  },
  chipTextLight: {
    color: colors.border.strong,
  },
  chipTextSelected: {
    color: colors.black,
  },
  chipTextLightSelected: {
    color: colors.white,
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  toggleGroup: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  toggleChip: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border.strong,
  },
  toggleChipLight: {
    backgroundColor: "#e0e0e0",
  },
  toggleChipActive: {
    backgroundColor: colors.black,
  },
  toggleChipText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.white,
  },
  toggleChipTextLight: {
    color: colors.border.strong,
  },
  toggleChipTextActive: {
    color: colors.white,
  },
});
