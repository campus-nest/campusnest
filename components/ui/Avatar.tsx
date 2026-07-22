import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, typography } from "@/src/constants/theme";

interface AvatarProps {
  uri?: string | null;
  initials?: string;
  size?: number;
  initialsSize?: number;
  bordered?: boolean;
  style?: ViewStyle;
}

export default function Avatar({
  uri,
  initials,
  size = 40,
  initialsSize = typography.size.md,
  bordered = false,
  style,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2 },
        bordered && styles.bordered,
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Text style={[styles.initials, { fontSize: initialsSize }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    overflow: "hidden",
  },
  bordered: {
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
});
