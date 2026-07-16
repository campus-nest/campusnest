import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface AddressSearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSearching: boolean;
}

// Free-text address search input + submit button, shared by the web and
// native branches of the select-location map picker.
export default function AddressSearchField({ value, onChangeText, onSubmit, isSearching }: AddressSearchFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for an address..."
        placeholderTextColor={colors.text.readable}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={isSearching}>
        {isSearching ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Search size={20} color={colors.white} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.white,
    fontSize: typography.size.md,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
