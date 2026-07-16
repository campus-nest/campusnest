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
import { colors, radius, spacing, typography } from "@/src/constants/theme";

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
              <X size={24} color={colors.white} />
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
                placeholderTextColor={colors.text.readable}
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
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Search size={20} color={colors.white} />
                )}
              </Pressable>
            </View>

            {selectedLocation && (
              <View style={styles.selectedInfo}>
                <MapPin size={20} color={colors.success.default} />
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
          <X size={24} color={colors.white} />
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
          <Check size={24} color={selectedLocation ? colors.success.default : colors.text.faint} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an address..."
          placeholderTextColor={colors.text.readable}
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
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Search size={20} color={colors.white} />
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
                    <MapPin size={24} color={colors.white} />
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
          <Navigation size={20} color={colors.accent.primary} />
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
            <MapPin size={24} color={colors.success.default} />
            <View style={styles.selectedTextContainer}>
              {isLoadingAddress ? (
                <ActivityIndicator color={colors.white} size="small" />
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
            <Check size={20} color={colors.black} />
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
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.screen,
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
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.white,
    fontSize: typography.size.md,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
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
  markerShadow: {
    width: 20,
    height: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginTop: -5,
  },
  currentLocationButton: {
    position: "absolute",
    right: spacing.lg,
    top: spacing.lg,
    width: 44,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsContainer: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: 70,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  instructionsText: {
    color: colors.white,
    fontSize: typography.size.base,
    textAlign: "center",
  },
  bottomSheet: {
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedAddress: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  selectedCoords: {
    color: colors.text.readable,
    fontSize: typography.size.sm,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: colors.black,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  // Web styles
  webContainer: {
    flex: 1,
  },
  webContent: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  webText: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    marginTop: 40,
  },
  webSubtext: {
    color: colors.text.readable,
    fontSize: typography.size.md,
    textAlign: "center",
  },
  webButtonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border.strong,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});
