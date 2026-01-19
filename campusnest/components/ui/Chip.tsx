import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  variant?: "default" | "light";
}

export default function Chip({
  label,
  selected = false,
  onPress,
  variant = "default",
}: ChipProps) {
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
          selected &&
            (isLight ? styles.chipTextLightSelected : styles.chipTextSelected),
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

export function ChipGroup({
  options,
  selected,
  onToggle,
  variant = "default",
}: ChipGroupProps) {
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

export function ToggleChipGroup({
  options,
  value,
  onChange,
  variant = "light",
}: ToggleChipGroupProps) {
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
  // Single Chip styles
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: "#1a1a1a",
    borderColor: "#333",
  },
  chipLight: {
    backgroundColor: "#fff",
    borderColor: "#bbb",
  },
  chipSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  chipLightSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextDefault: {
    color: "#fff",
  },
  chipTextLight: {
    color: "#333",
  },
  chipTextSelected: {
    color: "#000",
  },
  chipTextLightSelected: {
    color: "#fff",
  },

  // ChipGroup styles
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  // ToggleChipGroup styles
  toggleGroup: {
    flexDirection: "row",
    gap: 8,
  },
  toggleChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
  },
  toggleChipLight: {
    backgroundColor: "#e0e0e0",
  },
  toggleChipActive: {
    backgroundColor: "#000",
  },
  toggleChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
  },
  toggleChipTextLight: {
    color: "#333",
  },
  toggleChipTextActive: {
    color: "#fff",
  },
});