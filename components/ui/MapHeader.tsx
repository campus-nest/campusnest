import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

interface MapHeaderProps {
  title: string;
  onCancel: () => void;
  right?: ReactNode;
}

// Transparent X-to-cancel header used by full-screen map pickers, as opposed
// to PageHeader's back-chevron used on regular content screens.
export default function MapHeader({ title, onCancel, right }: MapHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onCancel} style={styles.button}>
        <X size={24} color={colors.white} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {right ?? <View style={styles.button} />}
    </View>
  );
}

export const mapHeaderButtonStyle = {
  width: 40,
  height: 40,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 20,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.screen,
  },
  button: mapHeaderButtonStyle,
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
});
