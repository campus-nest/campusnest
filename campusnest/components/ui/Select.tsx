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

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={styles.input}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={styles.valueText}>{selectedLabel}</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
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
    maxWidth: 300,
    position: "relative",
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  valueText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});
