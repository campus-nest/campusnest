import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { geocodingService, GeocodingResult } from "@/src/services/geocoding.service";

interface AddressInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onLocationVerified?: (location: GeocodingResult | null) => void;
  placeholder?: string;
  variant?: "dark" | "light";
  containerStyle?: ViewStyle;
  showVerifyButton?: boolean;
}

export default function AddressInput({
  label,
  value,
  onChangeText,
  onLocationVerified,
  placeholder = "Enter address",
  variant = "dark",
  containerStyle,
  showVerifyButton = true,
}: AddressInputProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [verifiedLocation, setVerifiedLocation] = useState<GeocodingResult | null>(null);

  const isLight = variant === "light";

  // Clear verified location when address changes
  useEffect(() => {
    setVerifiedLocation(null);
    onLocationVerified?.(null);
  }, [value]);

  const handleVerifyAddress = async () => {
    if (!value.trim()) {
      Alert.alert("Missing Address", "Please enter an address first.");
      return;
    }

    setIsGeocoding(true);

    try {
      const result = await geocodingService.geocodeAddress(value);

      if (result) {
        setVerifiedLocation(result);
        onLocationVerified?.(result);
        Alert.alert(
          "Address Found",
          `We found: ${result.displayName}\n\nLatitude: ${result.latitude.toFixed(6)}\nLongitude: ${result.longitude.toFixed(6)}`,
          [
            {
              text: "Use Different Address",
              style: "cancel",
              onPress: () => {
                setVerifiedLocation(null);
                onLocationVerified?.(null);
              },
            },
            { text: "Looks Good!", onPress: () => {} },
          ]
        );
      } else {
        Alert.alert(
          "Address Not Found",
          "We couldn't find that address. Please check the address and try again, or enter a more specific address (e.g., include city and province)."
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Error", "Something went wrong while verifying the address.");
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight && styles.labelLight]}>
          {label}
        </Text>
      )}

      <TextInput
        style={[styles.input, isLight && styles.inputLight]}
        placeholder={placeholder}
        placeholderTextColor={isLight ? "#777" : "#666"}
        value={value}
        onChangeText={onChangeText}
      />

      {showVerifyButton && (
        <Pressable
          style={[
            styles.verifyButton,
            isGeocoding && styles.verifyButtonDisabled,
            verifiedLocation && styles.verifyButtonVerified,
          ]}
          onPress={handleVerifyAddress}
          disabled={isGeocoding}
        >
          {isGeocoding ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>
              {verifiedLocation ? "✓ Address Verified" : "📍 Verify Address"}
            </Text>
          )}
        </Pressable>
      )}

      {verifiedLocation && (
        <View style={styles.verifiedBox}>
          <Text style={styles.verifiedText}>
            📍 {verifiedLocation.displayName}
          </Text>
          <Text style={styles.verifiedCoords}>
            Lat: {verifiedLocation.latitude.toFixed(4)}, Lng:{" "}
            {verifiedLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}

// Export a hook for using geocoding in forms
export function useAddressGeocoding() {
  const [verifiedLocation, setVerifiedLocation] = useState<GeocodingResult | null>(null);

  const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
    if (verifiedLocation) {
      return verifiedLocation;
    }

    try {
      const result = await geocodingService.geocodeAddress(address);
      return result;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  return {
    verifiedLocation,
    setVerifiedLocation,
    geocodeAddress,
  };
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
  verifyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonVerified: {
    backgroundColor: "#4CAF50",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  verifiedBox: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  verifiedText: {
    fontSize: 12,
    color: "#2e7d32",
    marginBottom: 4,
  },
  verifiedCoords: {
    fontSize: 11,
    color: "#666",
  },
});