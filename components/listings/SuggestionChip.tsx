import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface SuggestionChipProps {
  label: string;
  onPress: () => void;
}

// Quick-fill suggestion shown under the "Nearby University" field on the
// create-listing and edit-listing forms.
export default function SuggestionChip({ label, onPress }: SuggestionChipProps) {
  return (
    <Pressable style={styles.box} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: spacing.sm - 2,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: typography.size.md,
    color: colors.border.strong,
  },
});
