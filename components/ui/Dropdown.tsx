import { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  value: string | null;
  placeholder?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  variant?: "dark" | "light";
  containerStyle?: ViewStyle;
  icon?: string;
}

export default function Dropdown({
  label,
  value,
  placeholder = "Select option",
  options,
  onChange,
  variant = "dark",
  containerStyle,
  icon = "⌄",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const isLight = variant === "light";

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight && styles.labelLight]}>
          {label}
        </Text>
      )}

      <Pressable
        style={[styles.dropdown, isLight && styles.dropdownLight]}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text
          style={[
            styles.dropdownText,
            isLight && styles.dropdownTextLight,
            !value && styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={[styles.icon, isLight && styles.iconLight]}>{icon}</Text>
      </Pressable>

      {open && (
        <View style={[styles.optionsList, isLight && styles.optionsListLight]}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                isLight && styles.optionLight,
                value === option.value && styles.optionSelected,
              ]}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  isLight && styles.optionTextLight,
                  value === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// Simple cycle dropdown that cycles through options on press
interface CycleDropdownProps {
  label?: string;
  value: string | null;
  placeholder?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  variant?: "dark" | "light";
  containerStyle?: ViewStyle;
  icon?: string;
}

export function CycleDropdown({
  label,
  value,
  placeholder = "Select option",
  options,
  onChange,
  variant = "dark",
  containerStyle,
  icon = "⌄",
}: CycleDropdownProps) {
  const isLight = variant === "light";

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  const handlePress = () => {
    const currentIndex = options.findIndex((o) => o.value === value);
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight && styles.labelLight]}>
          {label}
        </Text>
      )}

      <Pressable
        style={[styles.dropdown, isLight && styles.dropdownLight]}
        onPress={handlePress}
      >
        <Text
          style={[
            styles.dropdownText,
            isLight && styles.dropdownTextLight,
            !value && styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={[styles.icon, isLight && styles.iconLight]}>{icon}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  labelLight: {
    color: colors.background.elevated,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.strong,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dropdownLight: {
    backgroundColor: colors.white,
    borderColor: colors.light.border,
  },
  dropdownText: {
    fontSize: typography.size.md,
    color: colors.white,
  },
  dropdownTextLight: {
    color: colors.border.strong,
  },
  placeholderText: {
    color: colors.text.faint,
  },
  icon: {
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  iconLight: {
    color: colors.text.dim,
  },
  optionsList: {
    marginTop: spacing.xs,
    backgroundColor: colors.border.subtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.strong,
    overflow: "hidden",
  },
  optionsListLight: {
    backgroundColor: colors.white,
    borderColor: colors.light.border,
  },
  option: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.strong,
  },
  optionLight: {
    borderBottomColor: colors.light.borderSubtle,
  },
  optionSelected: {
    backgroundColor: colors.border.strong,
  },
  optionText: {
    color: colors.white,
    fontSize: typography.size.md,
  },
  optionTextLight: {
    color: colors.border.strong,
  },
  optionTextSelected: {
    fontWeight: typography.weight.semibold,
  },
});
