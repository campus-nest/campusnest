import { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

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
    gap: 4,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  labelLight: {
    color: "#333",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownLight: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  dropdownText: {
    fontSize: 14,
    color: "#fff",
  },
  dropdownTextLight: {
    color: "#333",
  },
  placeholderText: {
    color: "#666",
  },
  icon: {
    fontSize: 14,
    color: "#aaa",
  },
  iconLight: {
    color: "#555",
  },
  optionsList: {
    marginTop: 4,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
  optionsListLight: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionLight: {
    borderBottomColor: "#eee",
  },
  optionSelected: {
    backgroundColor: "#333",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
  optionTextLight: {
    color: "#333",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});