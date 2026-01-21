import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { MapPin, Search, X, Check, Navigation } from "lucide-react-native";
import { geocodingService } from "@/src/services/geocoding.service";

// Dynamic imports for platform-specific map components
let MapView: any;
let Marker: any;
let UrlTile: any;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  UrlTile = maps.UrlTile;
}

interface SelectedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function SelectLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    initialLat?: string;
    initialLng?: string;
    initialAddress?: string;
  }>();

  const mapRef = useRef<any>(null);

  // Parse initial values from params
  const initialLat = params.initialLat ? parseFloat(params.initialLat) : null;
  const initialLng = params.initialLng ? parseFloat(params.initialLng) : null;

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(
      initialLat && initialLng
        ? {
            latitude: initialLat,
            longitude: initialLng,
            address: params.initialAddress,
          }
        : null,
    );

  const [region, setRegion] = useState<Region>({
    latitude: initialLat || 53.5232, // Default to Edmonton
    longitude: initialLng || -113.5263,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [searchQuery, setSearchQuery] = useState(params.initialAddress || "");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Request location permission and get current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      // Only get current location if no initial location was provided
      if (initialLat && initialLng) return;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setRegion(newRegion);
      } catch (error) {
        console.log("Could not get current location:", error);
      }
    };

    getCurrentLocation();
  }, [initialLat, initialLng]);

  // Handle map press to select location
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setSelectedLocation({ latitude, longitude });
    setIsLoadingAddress(true);

    // Reverse geocode to get address
    try {
      const address = await geocodingService.reverseGeocode(
        latitude,
        longitude,
      );
      setSelectedLocation({
        latitude,
        longitude,
        address: address || undefined,
      });
      if (address) {
        setSearchQuery(address);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Search for address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const result = await geocodingService.geocodeAddress(searchQuery);

      if (result) {
        const newRegion = {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setSelectedLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.displayName,
        });
        setSearchQuery(result.displayName);

        // Animate to the new location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 500);
        }
      } else {
        Alert.alert(
          "Not Found",
          "Could not find that address. Try a different search.",
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  // Go to current location
  const handleGoToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Could not get your current location.");
    }
  };

  // Confirm selection and go back
  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert("No Location", "Please tap on the map to select a location.");
      return;
    }

    // Navigate back with the selected location
    router.back();

    // Use a small delay to ensure navigation completes, then set params
    // We'll use a global state or callback pattern instead
    // For expo-router, we can use router.setParams or pass via a store

    // Since expo-router doesn't support returning data directly,
    // we'll use a simple global callback pattern
    if (global.onLocationSelected) {
      global.onLocationSelected(selectedLocation);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    router.back();
  };

  // Web fallback - show a simple form
  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webContainer}>
          <View style={styles.header}>
            <Pressable onPress={handleCancel} style={styles.headerButton}>
              <X size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Select Location</Text>
            <View style={styles.headerButton} />
          </View>

          <View style={styles.webContent}>
            <Text style={styles.webText}>
              Map selection is only available on mobile devices.
            </Text>
            <Text style={styles.webSubtext}>
              Please use the address search instead, or use the mobile app for
              map selection.
            </Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for an address..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <Pressable
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Search size={20} color="#fff" />
                )}
              </Pressable>
            </View>

            {selectedLocation && (
              <View style={styles.selectedInfo}>
                <MapPin size={20} color="#4CAF50" />
                <View style={styles.selectedTextContainer}>
                  <Text style={styles.selectedAddress}>
                    {selectedLocation.address || "Location selected"}
                  </Text>
                  <Text style={styles.selectedCoords}>
                    {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.webButtonRow}>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmButton,
                  !selectedLocation && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!selectedLocation}
              >
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Native mobile map view
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleCancel} style={styles.headerButton}>
          <X size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Location</Text>
        <Pressable
          onPress={handleConfirm}
          style={[
            styles.headerButton,
            !selectedLocation && styles.headerButtonDisabled,
          ]}
          disabled={!selectedLocation}
        >
          <Check size={24} color={selectedLocation ? "#4CAF50" : "#666"} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an address..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Search size={20} color="#fff" />
          )}
        </Pressable>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {MapView && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
            onMapReady={() => setMapReady(true)}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {UrlTile && (
              <UrlTile
                urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                tileSize={256}
                subdomains={["a", "b", "c", "d"]}
              />
            )}

            {mapReady && selectedLocation && Marker && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <MapPin size={24} color="#fff" />
                  </View>
                  <View style={styles.markerShadow} />
                </View>
              </Marker>
            )}
          </MapView>
        )}

        {/* Current Location Button */}
        <Pressable
          style={styles.currentLocationButton}
          onPress={handleGoToCurrentLocation}
        >
          <Navigation size={20} color="#007AFF" />
        </Pressable>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Tap on the map to select your listing location
          </Text>
        </View>
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={styles.bottomSheet}>
          <View style={styles.selectedInfo}>
            <MapPin size={24} color="#4CAF50" />
            <View style={styles.selectedTextContainer}>
              {isLoadingAddress ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.selectedAddress} numberOfLines={2}>
                    {selectedLocation.address || "Address not available"}
                  </Text>
                  <Text style={styles.selectedCoords}>
                    {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </Text>
                </>
              )}
            </View>
          </View>

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Check size={20} color="#000" />
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

// Declare global callback type
declare global {
  var onLocationSelected: ((location: SelectedLocation) => void) | undefined;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerShadow: {
    width: 20,
    height: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginTop: -5,
  },
  currentLocationButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 70,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  instructionsText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
  bottomSheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 16,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedAddress: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  selectedCoords: {
    color: "#999",
    fontSize: 12,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  // Web styles
  webContainer: {
    flex: 1,
  },
  webContent: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  webText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 40,
  },
  webSubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  webButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
