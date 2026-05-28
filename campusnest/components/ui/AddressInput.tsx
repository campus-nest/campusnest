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
        placeholderTextColor={isLight ? "#777" : "#666"}
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
        <MapPin size={18} color={selectedLocation ? "#fff" : "#007AFF"} />
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
            <Navigation size={16} color="#4CAF50" />
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
    gap: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  labelLight: {
    color: "#333",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputLight: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    color: "#000",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  mapButtonSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  mapButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  mapButtonTextSelected: {
    color: "#fff",
  },
  locationInfo: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2e7d32",
  },
  locationCoords: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  helperTextLight: {
    color: "#666",
  },
});
