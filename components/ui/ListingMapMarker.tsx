import { StyleSheet, View } from "react-native";
import { Home } from "lucide-react-native";
import { colors, radius } from "@/src/constants/theme";

interface ListingMapMarkerProps {
  highlighted?: boolean;
}

// Pin marker rendered per-listing on the explore map, with a highlighted
// state for the top match.
export default function ListingMapMarker({ highlighted }: ListingMapMarkerProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.content, highlighted && styles.highlightedContent]}>
        <Home size={16} color={highlighted ? colors.white : colors.black} />
      </View>
      <View style={[styles.arrow, highlighted && styles.highlightedArrow]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.accent.secondary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.accent.secondary,
    marginTop: -1,
  },
  highlightedContent: {
    backgroundColor: colors.accent.secondary,
    borderColor: colors.map.markerHighlightBorder,
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  highlightedArrow: {
    borderTopColor: colors.accent.secondary,
    transform: [{ scale: 1.2 }],
    marginTop: -2,
  },
});
