import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { spacing } from "@/src/constants/theme";

type SpacingKey = keyof typeof spacing;

interface StackProps {
  children: ReactNode;
  gap?: SpacingKey;
  direction?: "row" | "column";
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
  flex?: number;
  style?: ViewStyle;
}

// Generic layout wrapper for the gap/row groupings screens used to redefine
// locally (e.g. `form: { gap: spacing.lg }`, `row: { flexDirection: "row" }`).
export default function Stack({
  children,
  gap = "md",
  direction = "column",
  align,
  justify,
  wrap,
  flex,
  style,
}: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: spacing[gap],
        },
        align && { alignItems: align },
        justify && { justifyContent: justify },
        wrap && { flexWrap: "wrap" },
        flex !== undefined && { flex },
        style,
      ]}
    >
      {children}
    </View>
  );
}
