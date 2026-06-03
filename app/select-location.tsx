import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Search, X, Check, Navigation } from "lucide-react-native";
import { useSelectLocation } from "@/hooks/useSelectLocation";

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

export default function SelectLocationScreen() {
  const {
    mapRef,
    selectedLocation,
    region,
    searchQuery,
    setSearchQuery,
    isSearching,
    isLoadingAddress,
    mapReady,
    setMapReady,
    handleMapPress,
    handleSearch,
    handleGoToCurrentLocation,
    handleConfirm,
    handleCancel,
  } = useSelectLocation();

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
    height: 48,
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
