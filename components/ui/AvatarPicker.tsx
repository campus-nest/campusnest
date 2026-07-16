import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Upload } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface AvatarPickerProps {
  uri?: string | null;
  onPress: () => void;
  size?: number;
}

// Tap-to-change profile photo with an upload-icon badge, used on the
// edit-profile screen.
export default function AvatarPicker({ uri, onPress, size = 100 }: AvatarPickerProps) {
  const circle = { width: size, height: size, borderRadius: size / 2 };
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {uri ? (
        <Image source={{ uri }} style={circle} />
      ) : (
        <View style={[circle, styles.placeholder]}>
          <Text style={styles.placeholderText}>Add Photo</Text>
        </View>
      )}
      <View style={styles.badge}>
        <Upload color={colors.white} size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
  },
  placeholder: {
    backgroundColor: colors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.text.faint,
    fontSize: typography.size.md,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    padding: spacing.sm,
    borderRadius: radius.xl,
  },
});
