import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface DateFieldProps {
  label: string;
  value: Date | null;
  placeholder: string;
  show: boolean;
  onOpen: () => void;
  onChange: (date: Date) => void;
}

// Label + pressable date display + native date picker, shared by the
// "Move In Date" field on both the create-listing and edit-listing forms.
export default function DateField({ label, value, placeholder, show, onOpen, onChange }: DateFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={onOpen}>
        <Text style={styles.dropdownText}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.border.strong,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    width: "100%",
  },
  dropdownText: {
    fontSize: typography.size.md,
    color: colors.border.strong,
  },
  icon: {
    fontSize: typography.size.md,
  },
});
