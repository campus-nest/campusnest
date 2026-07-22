import { ReactNode } from "react";
import { View } from "react-native";

interface BottomIllustrationProps {
  height: number;
  children: ReactNode;
}

// Full-width decorative SVG pinned to the bottom of an onboarding screen
// (landing, pre-signup) — non-interactive, height varies per illustration.
export default function BottomIllustration({ height, children }: BottomIllustrationProps) {
  return (
    <View style={{ height, width: "100%" }} pointerEvents="none">
      {children}
    </View>
  );
}
