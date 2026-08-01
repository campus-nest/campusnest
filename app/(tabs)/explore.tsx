import React from "react";
import Screen from "@/components/ui/Screen";
import { Home, MapPin } from "lucide-react-native";
import FilterPills from "@/components/ui/FilterPills";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import IconCircle from "@/components/ui/IconCircle";
import PriceFilterPill from "@/components/ui/PriceFilterPill";
import ListingMapMarker from "@/components/ui/ListingMapMarker";
import CircleFAB from "@/components/ui/CircleFAB";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { useExplore } from "@/hooks/useExplore";
import { colors, layout, radius, spacing, typography } from "@/src/constants/theme";
import { Platform, Pressable, Text, View } from "react-native";

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

const FILTER_OPTIONS: { label: string; value: "new" | "closest" | "cheapest" | "moveIn" }[] = [
  { label: "New", value: "new" },
  { label: "Closest", value: "closest" },
  { label: "Cheapest", value: "cheapest" },
  { label: "Move-In", value: "moveIn" },
];

export default function ExploreScreen() {
  const {
    listings,
    loading,
    userRole,
    mapReady,
    setMapReady,
    activeFilter,
    setActiveFilter,
    minPrice,
    maxPrice,
    isPriceModalVisible,
    setPriceModalVisible,
    region,
    fetchListings,
    handleMarkerPress,
    openOSMAttribution,
    handleApplyPrice,
    handleGoHome,
    priceActive,
  } = useExplore();

  // If landlord, show message that this page is for students only
  if (!loading && userRole === "landlord") {
    return (
      <Screen>
        <EmptyState
          icon={<Home size={48} color={colors.text.faint} />}
          title="Explore is for Students"
          subtitle="This map view is only available for student accounts. Use the home tab to manage your listings."
          actionLabel="Go to Home"
          onAction={handleGoHome}
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading listings..." />
      </Screen>
    );
  }

  // Web fallback - show list view instead
  if (Platform.OS === "web") {
    return (
      <Screen>
        <View style={{ flex: 1, position: "relative" }}>
          <View
            style={{
              padding: spacing.lg,
              backgroundColor: colors.background.elevated,
              borderBottomWidth: 1,
              borderBottomColor: colors.border.strong,
            }}
          >
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.size.xxl,
                fontWeight: typography.weight.bold,
                marginBottom: spacing.sm,
              }}
            >
              Nearby Listings
            </Text>
            <FilterPills options={FILTER_OPTIONS} value={activeFilter} onChange={setActiveFilter} />
          </View>

          <View style={{ flex: 1, padding: spacing.lg }}>
            {listings.map((listing) => (
              <Pressable
                key={listing.id}
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.background.elevated,
                  borderRadius: radius.md,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                  alignItems: "center",
                }}
                onPress={() => handleMarkerPress(listing.id)}
              >
                <IconCircle variant="onWhite" size={50} style={{ marginRight: spacing.lg }}>
                  <Home size={24} color={colors.accent.secondary} />
                </IconCircle>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: typography.size.lg,
                      fontWeight: typography.weight.semibold,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {listing.title}
                  </Text>
                  <Text style={{ color: colors.text.readable, fontSize: typography.size.base, marginBottom: spacing.xs }}>
                    {listing.address}
                  </Text>
                  <Text style={{ color: colors.accent.secondary, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>
                    ${listing.rent}/month
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <CircleFAB onPress={fetchListings} style={{ position: "absolute", bottom: spacing.giant, right: spacing.lg }}>
            <Text style={{ fontSize: typography.size.xxl, color: colors.black }}>↻</Text>
          </CircleFAB>
        </View>
      </Screen>
    );
  }

  // Native mobile map view
  return (
    <Screen noPadding>
      <View style={{ flex: 1, position: "relative" }}>
        {MapView && (
          <MapView
            style={{ flex: 1, width: "100%", height: "100%" }}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            toolbarEnabled={false}
            onMapReady={() => setMapReady(true)}
          >
            {/* Use Stadia Maps (free tier, no User-Agent required) */}
            {/* Alternative: CartoDB tiles - no registration needed */}
            {UrlTile && (
              <UrlTile
                urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                tileSize={256}
                subdomains={["a", "b", "c", "d"]}
              />
            )}

            {/* Listing markers */}
            {mapReady &&
              Marker &&
              listings.map((listing, index) => (
                <Marker
                  key={listing.id}
                  coordinate={{
                    latitude: listing.latitude!,
                    longitude: listing.longitude!,
                  }}
                  title={listing.title}
                  description={`$${listing.rent}/month`}
                  onPress={() => handleMarkerPress(listing.id)}
                  zIndex={index === 0 ? 999 : 1}
                >
                  <ListingMapMarker highlighted={index === 0} />
                </Marker>
              ))}
          </MapView>
        )}

        <View style={{ position: "absolute", top: spacing.md, left: 0, right: 0, zIndex: 10 }}>
          <FilterPills
            customPrependPill={
              <PriceFilterPill label="Price" active={priceActive} onPress={() => setPriceModalVisible(true)} />
            }
            options={FILTER_OPTIONS}
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </View>

        <PriceRangeModal
          visible={isPriceModalVisible}
          initialMin={minPrice}
          initialMax={maxPrice}
          onClose={() => setPriceModalVisible(false)}
          onApply={handleApplyPrice}
        />

        {/* Attribution for CartoDB */}
        <Pressable
          style={{
            position: "absolute",
            bottom: layout.navBarClearance,
            left: spacing.sm,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            paddingHorizontal: spacing.sm - 2,
            paddingVertical: spacing.xs - 1,
            borderRadius: radius.sm - 4,
          }}
          onPress={openOSMAttribution}
        >
          <Text style={{ fontSize: typography.size.xs - 1, color: colors.black }}>© OpenStreetMap | © CARTO</Text>
        </Pressable>

        {/* Listing count badge */}
        {listings.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: layout.navBarClearance + spacing.huge + spacing.md,
              right: spacing.lg,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.xl,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm - 2,
            }}
          >
            <MapPin size={14} color={colors.white} />
            <Text style={{ color: colors.text.primary, fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* Refresh button */}
        <CircleFAB onPress={fetchListings} style={{ position: "absolute", bottom: layout.navBarClearance, right: spacing.lg }}>
          <Text style={{ fontSize: typography.size.xxl, color: colors.black }}>↻</Text>
        </CircleFAB>
      </View>
    </Screen>
  );
}
