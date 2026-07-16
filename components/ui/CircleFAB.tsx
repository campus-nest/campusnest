import { ReactNode } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/src/constants/theme";

interface CircleFABProps {
  children: ReactNode;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
}

// Circular floating action button (map refresh, recenter-on-me, ...).
export default function CircleFAB({ children, onPress, size = 48, style }: CircleFABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
