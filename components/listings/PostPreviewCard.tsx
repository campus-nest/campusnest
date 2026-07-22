import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface PostPreviewCardProps {
  title: string;
  body: string;
  onPress: () => void;
  icon?: ReactNode;
  action?: ReactNode;
  numberOfLines?: number;
}

// Post title + body preview row, used by both the Student Posts feed and the
// Saved posts list — optionally prefixed with an icon and suffixed with an
// action (save/unsave toggle).
export default function PostPreviewCard({
  title,
  body,
  onPress,
  icon,
  action,
  numberOfLines = 2,
}: PostPreviewCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {icon && <View style={styles.iconSlot}>{icon}</View>}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text} numberOfLines={numberOfLines}>{body}</Text>
      </View>
      {action}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconSlot: {
    paddingTop: spacing.xs,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    lineHeight: 20,
  },
  text: {
    color: colors.text.secondary,
    fontSize: typography.size.base,
    lineHeight: 18,
  },
});
