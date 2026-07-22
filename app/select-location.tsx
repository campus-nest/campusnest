import { View, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Navigation } from "lucide-react-native";
import { useSelectLocation } from "@/hooks/useSelectLocation";
import { colors, radius, spacing, typography } from "@/src/constants/theme";
import MapHeader, { mapHeaderButtonStyle } from "@/components/ui/MapHeader";
import AddressSearchField from "@/components/ui/AddressSearchField";
import SelectedLocationSummary from "@/components/ui/SelectedLocationSummary";
import MapPinMarker from "@/components/ui/MapPinMarker";
import CircleFAB from "@/components/ui/CircleFAB";
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.screen }}>
        <MapHeader title="Select Location" onCancel={handleCancel} />

        <Stack gap="xl" style={{ flex: 1, padding: spacing.xl }}>
          <Text style={{ color: colors.white, fontSize: typography.size.xl, fontWeight: typography.weight.semibold, textAlign: "center", marginTop: spacing.xxxxl }}>
            Map selection is only available on mobile devices.
          </Text>
          <Text style={{ color: colors.text.readable, fontSize: typography.size.md, textAlign: "center" }}>
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

          <Stack direction="row" gap="md" style={{ marginTop: spacing.xl }}>
            <Pressable
              style={{ flex: 1, backgroundColor: colors.border.strong, borderRadius: radius.md, paddingVertical: spacing.md + 2, alignItems: "center" }}
              onPress={handleCancel}
            >
              <Text style={{ color: colors.white, fontSize: typography.size.lg, fontWeight: typography.weight.semibold }}>Cancel</Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.white,
                borderRadius: radius.md,
                paddingVertical: spacing.md + 2,
                gap: spacing.sm,
                opacity: selectedLocation ? 1 : 0.5,
              }}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={{ color: colors.black, fontSize: typography.size.lg, fontWeight: typography.weight.semibold }}>
                Confirm Location
              </Text>
            </Pressable>
          </Stack>
        </Stack>
      </SafeAreaView>
    );
  }

  // Native mobile map view
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.screen }}>
      <MapHeader
        title="Select Location"
        onCancel={handleCancel}
        right={
          <Pressable
            onPress={handleConfirm}
            style={[mapHeaderButtonStyle, { opacity: selectedLocation ? 1 : 0.5 }]}
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
      <View style={{ flex: 1, position: "relative" }}>
        {MapView && (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
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

        <CircleFAB
          size={44}
          onPress={handleGoToCurrentLocation}
          style={{ position: "absolute", right: spacing.lg, top: spacing.lg }}
        >
          <Navigation size={20} color={colors.accent.primary} />
        </CircleFAB>

        <View
          style={{
            position: "absolute",
            top: spacing.lg,
            left: spacing.lg,
            right: 70,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Text style={{ color: colors.white, fontSize: typography.size.base, textAlign: "center" }}>
            Tap on the map to select your listing location
          </Text>
        </View>
      </View>

      {selectedLocation && (
        <Stack
          gap="lg"
          style={{
            backgroundColor: colors.background.elevated,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            padding: spacing.xl,
          }}
        >
          <SelectedLocationSummary
            address={selectedLocation.address}
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            fallbackText="Address not available"
            loading={isLoadingAddress}
            size={24}
          />

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.white,
              borderRadius: radius.md,
              paddingVertical: spacing.md + 2,
              gap: spacing.sm,
            }}
            onPress={handleConfirm}
          >
            <Check size={20} color={colors.black} />
            <Text style={{ color: colors.black, fontSize: typography.size.lg, fontWeight: typography.weight.semibold }}>
              Confirm Location
            </Text>
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
