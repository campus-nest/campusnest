import { StyleSheet, View } from "react-native";
import { MapPin } from "lucide-react-native";
import { colors, spacing } from "@/src/constants/theme";

// The custom marker pin rendered at the selected point on the map.
export default function MapPinMarker() {
  return (
    <View style={styles.container}>
      <View style={styles.pin}>
        <MapPin size={24} color={colors.white} />
      </View>
      <View style={styles.shadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  pin: {
    backgroundColor: colors.accent.primary,
    borderRadius: 20,
    padding: spacing.sm,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shadow: {
    width: 20,
    height: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginTop: -5,
  },
});
