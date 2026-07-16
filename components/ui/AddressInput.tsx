import { useRouter } from "expo-router";
import { MapPin, Navigation } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AddressInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onLocationSelected?: (location: LocationData | null) => void;
  selectedLocation?: LocationData | null;
  placeholder?: string;
  variant?: "dark" | "light";
  containerStyle?: ViewStyle;
}

export default function AddressInput({
  label,
  value,
  onChangeText,
  onLocationSelected,
  selectedLocation,
  placeholder = "Enter address",
  variant = "dark",
  containerStyle,
}: AddressInputProps) {
  const router = useRouter();
  const isLight = variant === "light";

  // Set up the global callback for receiving location from map screen
  useEffect(() => {
    global.onLocationSelected = (location: LocationData) => {
      onLocationSelected?.(location);
      if (location.address) {
        onChangeText(location.address);
      }
    };

    return () => {
      global.onLocationSelected = undefined;
    };
  }, [onLocationSelected, onChangeText]);

  // Open map picker screen
  const handleOpenMapPicker = useCallback(() => {
    router.push({
      pathname: "/select-location",
      params: {
        initialLat: selectedLocation?.latitude?.toString() || "",
        initialLng: selectedLocation?.longitude?.toString() || "",
        initialAddress: value || "",
      },
    });
  }, [router, selectedLocation, value]);

  // Clear location
  const handleClearLocation = useCallback(() => {
    onLocationSelected?.(null);
  }, [onLocationSelected]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight && styles.labelLight]}>
          {label}
        </Text>
      )}

      {/* Address text input (for display/manual entry) */}
      <TextInput
        style={[styles.input, isLight && styles.inputLight]}
        placeholder={placeholder}
        placeholderTextColor={isLight ? colors.light.placeholder : colors.text.faint}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          // Clear the coordinates if user manually edits the address
          if (selectedLocation) {
            onLocationSelected?.(null);
          }
        }}
      />

      {/* Select on Map Button */}
      <Pressable
        style={[styles.mapButton, selectedLocation && styles.mapButtonSelected]}
        onPress={handleOpenMapPicker}
      >
        <MapPin size={18} color={selectedLocation ? colors.white : colors.accent.primary} />
        <Text
          style={[
            styles.mapButtonText,
            selectedLocation && styles.mapButtonTextSelected,
          ]}
        >
          {selectedLocation ? "Change Location on Map" : "📍 Select on Map"}
        </Text>
      </Pressable>

      {/* Show selected location info */}
      {selectedLocation && (
        <View style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <Navigation size={16} color={colors.success.default} />
            <Text style={styles.locationTitle}>Location Selected</Text>
          </View>
          <Text style={styles.locationCoords}>
            Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
            {selectedLocation.longitude.toFixed(6)}
          </Text>
          <Pressable onPress={handleClearLocation} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        </View>
      )}

      {/* Helper text */}
      {!selectedLocation && (
        <Text style={[styles.helperText, isLight && styles.helperTextLight]}>
          Tap &quot;Select on Map&quot; to pin your exact location
        </Text>
      )}
    </View>
  );
}

// Declare global callback type
declare global {
  var onLocationSelected: ((location: LocationData) => void) | undefined;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  labelLight: {
    color: colors.light.text,
  },
  input: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.white,
    fontSize: typography.size.md,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  inputLight: {
    backgroundColor: colors.white,
    borderColor: colors.light.border,
    color: colors.black,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent.background,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    width: "100%",
  },
  mapButtonSelected: {
    backgroundColor: colors.success.default,
    borderColor: colors.success.default,
  },
  mapButtonText: {
    color: colors.accent.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
  },
  mapButtonTextSelected: {
    color: colors.white,
  },
  locationInfo: {
    backgroundColor: colors.success.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success.border,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.xs,
  },
  locationTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.success.text,
  },
  locationCoords: {
    fontSize: typography.size.sm,
    color: colors.text.faint,
    marginBottom: spacing.sm,
  },
  clearButton: {
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: colors.danger.text,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  helperText: {
    fontSize: typography.size.sm,
    color: colors.text.readable,
    fontStyle: "italic",
  },
  helperTextLight: {
    color: colors.text.faint,
  },
});
