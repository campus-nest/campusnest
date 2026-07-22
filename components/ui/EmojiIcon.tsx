import { Text } from "react-native";
import { spacing } from "@/src/constants/theme";

interface EmojiIconProps {
  children: string;
  size?: number;
}

// Large standalone emoji used as a screen-heading icon (e.g. the envelope on
// the verify-email screen).
export default function EmojiIcon({ children, size = 64 }: EmojiIconProps) {
  return <Text style={{ fontSize: size, marginBottom: spacing.xs }}>{children}</Text>;
}
