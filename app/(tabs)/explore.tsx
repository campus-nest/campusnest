import React from "react";
import Screen from "@/components/ui/Screen";
import { Home, MapPin } from "lucide-react-native";
import FilterPills from "@/components/ui/FilterPills";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import { useExplore } from "@/hooks/useExplore";
import { colors, radius, spacing, typography } from "@/src/constants/theme";
import { pillStyles } from "@/components/ui/FilterPills";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
        <View style={styles.messageContainer}>
          <Home size={48} color="#666" />
          <Text style={styles.messageTitle}>Explore is for Students</Text>
          <Text style={styles.messageText}>
            This map view is only available for student accounts. Use the home
            tab to manage your listings.
          </Text>
          <Pressable
            style={styles.goHomeButton}
            onPress={handleGoHome}
          >
            <Text style={styles.goHomeButtonText}>Go to Home</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      </Screen>
    );
  }

  // Web fallback - show list view instead
  if (Platform.OS === "web") {
    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.webHeader}>
            <Text style={styles.webTitle}>Nearby Listings</Text>
            <FilterPills
              options={[
                { label: "New", value: "new" },
                { label: "Closest", value: "closest" },
                { label: "Cheapest", value: "cheapest" },
                { label: "Move-In", value: "moveIn" },
              ]}
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </View>

          <View style={styles.webListContainer}>
            {listings.map((listing) => (
              <Pressable
                key={listing.id}
                style={styles.listingCard}
                onPress={() => handleMarkerPress(listing.id)}
              >
                <View style={styles.cardIcon}>
                  <Home size={24} color="#0066CC" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{listing.title}</Text>
                  <Text style={styles.cardAddress}>{listing.address}</Text>
                  <Text style={styles.cardRent}>${listing.rent}/month</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.refreshButton} onPress={fetchListings}>
            <Text style={styles.refreshText}>↻</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Native mobile map view
  return (
    <Screen noPadding>
      <View style={styles.container}>
        {MapView && (
          <MapView
            style={styles.map}
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
              listings.map((listing, index) => {
                const isTopMatch = index === 0;
                return (
                  <Marker
                    key={listing.id}
                    coordinate={{
                      latitude: listing.latitude!,
                      longitude: listing.longitude!,
                    }}
                    title={listing.title}
                    description={`$${listing.rent}/month`}
                    onPress={() => handleMarkerPress(listing.id)}
                    zIndex={isTopMatch ? 999 : 1}
                  >
                    {/* Custom marker */}
                    <View style={styles.customMarker}>
                      <View
                        style={[
                          styles.markerContent,
                          isTopMatch && styles.highlightedMarkerContent,
                        ]}
                      >
                        <Home size={16} color={isTopMatch ? "#fff" : "#000"} />
                      </View>
                      <View
                        style={[
                          styles.markerArrow,
                          isTopMatch && styles.highlightedMarkerArrow,
                        ]}
                      />
                    </View>
                  </Marker>
                );
              })}
          </MapView>
        )}

        <View style={styles.filterOverlay}>
          <FilterPills
            customPrependPill={
              <Pressable
                onPress={() => setPriceModalVisible(true)}
                style={[
                  pillStyles.pill,
                  priceActive && pillStyles.pillActive,
                  { marginRight: spacing.sm },
                ]}
              >
                <Text
                  style={[
                    pillStyles.text,
                    priceActive && pillStyles.textActive,
                  ]}
                >
                  Price
                </Text>
              </Pressable>
            }
            options={[
              { label: "New", value: "new" },
              { label: "Closest", value: "closest" },
              { label: "Cheapest", value: "cheapest" },
              { label: "Move-In", value: "moveIn" },
            ]}
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
        <Pressable style={styles.attribution} onPress={openOSMAttribution}>
          <Text style={styles.attributionText}>© OpenStreetMap | © CARTO</Text>
        </Pressable>

        {/* Listing count badge */}
        {listings.length > 0 && (
          <View style={styles.countBadge}>
            <MapPin size={14} color="#fff" />
            <Text style={styles.countText}>
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* Refresh button */}
        <Pressable style={styles.refreshButton} onPress={fetchListings}>
          <Text style={styles.refreshText}>↻</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  filterOverlay: {
    position: "absolute",
    top: spacing.md,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.text.primary,
    marginTop: spacing.md,
    fontSize: typography.size.md,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxxl,
  },
  messageTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  messageText: {
    color: colors.text.readable,
    fontSize: typography.size.md,
    textAlign: "center",
    lineHeight: 20,
  },
  goHomeButton: {
    marginTop: spacing.xxl,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  goHomeButtonText: {
    color: colors.black,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  customMarker: {
    alignItems: "center",
  },
  markerContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.accent.secondary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.accent.secondary,
    marginTop: -1,
  },
  highlightedMarkerContent: {
    backgroundColor: colors.accent.secondary,
    borderColor: "#003366",
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  highlightedMarkerArrow: {
    borderTopColor: colors.accent.secondary,
    transform: [{ scale: 1.2 }],
    marginTop: -2,
  },
  attribution: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 10,
    color: colors.black,
  },
  countBadge: {
    position: "absolute",
    bottom: 140,
    right: spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm - 2,
  },
  countText: {
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  refreshButton: {
    position: "absolute",
    bottom: 80,
    right: spacing.lg,
    backgroundColor: colors.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshText: {
    fontSize: 24,
    color: colors.black,
  },
  webHeader: {
    padding: spacing.lg,
    backgroundColor: colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.strong,
  },
  webTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  webListContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  listingCard: {
    flexDirection: "row",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
  },
  cardAddress: {
    color: colors.text.readable,
    fontSize: typography.size.base,
    marginBottom: spacing.xs,
  },
  cardRent: {
    color: colors.accent.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
