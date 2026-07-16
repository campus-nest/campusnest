import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Navigation } from "lucide-react-native";
import { useSelectLocation } from "@/hooks/useSelectLocation";
import { colors, radius, spacing, typography } from "@/src/constants/theme";
import MapHeader, { mapHeaderButtonStyle } from "@/components/ui/MapHeader";
import AddressSearchField from "@/components/ui/AddressSearchField";
import SelectedLocationSummary from "@/components/ui/SelectedLocationSummary";
import MapPinMarker from "@/components/ui/MapPinMarker";
import Stack from "@/components/ui/Stack";

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
        <MapHeader title="Select Location" onCancel={handleCancel} />

        <Stack gap="xl" style={styles.webContent}>
          <Text style={styles.webText}>
            Map selection is only available on mobile devices.
          </Text>
          <Text style={styles.webSubtext}>
            Please use the address search instead, or use the mobile app for
            map selection.
          </Text>

          <AddressSearchField
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            isSearching={isSearching}
          />

          {selectedLocation && (
            <SelectedLocationSummary
              address={selectedLocation.address}
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              fallbackText="Location selected"
            />
          )}

          <Stack direction="row" gap="md" style={styles.webButtonRow}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmButton, !selectedLocation && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </Pressable>
          </Stack>
        </Stack>
      </SafeAreaView>
    );
  }

  // Native mobile map view
  return (
    <SafeAreaView style={styles.container}>
      <MapHeader
        title="Select Location"
        onCancel={handleCancel}
        right={
          <Pressable
            onPress={handleConfirm}
            style={[mapHeaderButtonStyle, !selectedLocation && styles.headerButtonDisabled]}
            disabled={!selectedLocation}
          >
            <Check size={24} color={selectedLocation ? colors.success.default : colors.text.faint} />
          </Pressable>
        }
      />

      <AddressSearchField
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        isSearching={isSearching}
      />

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
                <MapPinMarker />
              </Marker>
            )}
          </MapView>
        )}

        <Pressable style={styles.currentLocationButton} onPress={handleGoToCurrentLocation}>
          <Navigation size={20} color={colors.accent.primary} />
        </Pressable>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Tap on the map to select your listing location
          </Text>
        </View>
      </View>

      {selectedLocation && (
        <Stack gap="lg" style={styles.bottomSheet}>
          <SelectedLocationSummary
            address={selectedLocation.address}
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            fallbackText="Address not available"
            loading={isLoadingAddress}
            size={24}
          />

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Check size={20} color={colors.black} />
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>
        </Stack>
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
  headerButtonDisabled: {
    opacity: 0.5,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
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
  webContent: {
    flex: 1,
    padding: spacing.xl,
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
