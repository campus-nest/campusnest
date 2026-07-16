import { Pressable, Text } from "react-native";
import { pillStyles } from "@/components/ui/FilterPills";
import { spacing } from "@/src/constants/theme";

interface PriceFilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

// The "Price" / "$min–$max" filter pill prepended to the FilterPills row on
// the home and explore tabs.
export default function PriceFilterPill({ label, active, onPress }: PriceFilterPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[pillStyles.pill, active && pillStyles.pillActive, { marginRight: spacing.sm }]}
    >
      <Text style={[pillStyles.text, active && pillStyles.textActive]}>{label}</Text>
    </Pressable>
  );
}
