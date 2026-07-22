import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MapPin } from "lucide-react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

interface SelectedLocationSummaryProps {
  address?: string;
  latitude: number;
  longitude: number;
  fallbackText: string;
  loading?: boolean;
  size?: number;
}

// Pin icon + address/coordinates readout, shown once a location is selected
// on both the web and native branches of the select-location map picker.
export default function SelectedLocationSummary({
  address,
  latitude,
  longitude,
  fallbackText,
  loading = false,
  size = 20,
}: SelectedLocationSummaryProps) {
  return (
    <View style={styles.row}>
      <MapPin size={size} color={colors.success.default} />
      <View style={styles.textContainer}>
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <>
            <Text style={styles.address} numberOfLines={2}>
              {address || fallbackText}
            </Text>
            <Text style={styles.coords}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  address: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  coords: {
    color: colors.text.readable,
    fontSize: typography.size.sm,
  },
});
