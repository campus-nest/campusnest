import { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface SectionProps {
  title?: string;
  children: ReactNode;
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export default function Section({
  title,
  children,
  variant = "dark",
  style,
}: SectionProps) {
  const isLight = variant === "light";

  return (
    <View style={[styles.section, style]}>
      {title && (
        <Text style={[styles.title, isLight && styles.titleLight]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

interface DividerProps {
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export function Divider({ variant = "dark", style }: DividerProps) {
  const isLight = variant === "light";

  return (
    <View
      style={[
        styles.divider,
        isLight ? styles.dividerLight : styles.dividerDark,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",
  },
  titleLight: {
    color: "#111",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  dividerDark: {
    backgroundColor: "#333",
  },
  dividerLight: {
    backgroundColor: "#d0d0d0",
  },
});
