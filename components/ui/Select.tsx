import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

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
    gap: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  triggerOpen: {
    borderColor: "#555",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerText: {
    color: "#fff",
    fontSize: 16,
  },
  placeholderText: {
    color: "#666",
  },
  chevron: {
    color: "#666",
    fontSize: 20,
    lineHeight: 20,
    transform: [{ rotate: "90deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "270deg" }],
  },
  dropdown: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#555",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  optionActive: {
    backgroundColor: "#222",
  },
  optionText: {
    color: "#ccc",
    fontSize: 16,
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});