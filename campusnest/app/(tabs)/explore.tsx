import React from "react";
import Screen from "@/components/ui/Screen";
import { Home, MapPin } from "lucide-react-native";
import FilterPills from "@/components/ui/FilterPills";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import { useExplore } from "@/hooks/useExplore";
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
                  styles.pill,
                  priceActive && styles.pillActive,
                  { marginRight: 8 },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    priceActive && styles.textActive,
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
    top: 12,
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
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  messageTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  messageText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  goHomeButton: {
    marginTop: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  goHomeButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0066CC",
    shadowColor: "#000",
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
    borderTopColor: "#0066CC",
    marginTop: -1,
  },
  highlightedMarkerContent: {
    backgroundColor: "#0066CC",
    borderColor: "#003366",
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  highlightedMarkerArrow: {
    borderTopColor: "#0066CC",
    transform: [{ scale: 1.2 }],
    marginTop: -2,
  },
  // OSM Attribution (REQUIRED by OSM policy)
  attribution: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 10,
    color: "#000",
  },
  countBadge: {
    position: "absolute",
    bottom: 140,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  refreshButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    backgroundColor: "#fff",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshText: {
    fontSize: 24,
    color: "#000",
  },
  // Web-specific styles
  webHeader: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  webTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  webListContainer: {
    flex: 1,
    padding: 16,
  },
  listingCard: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardAddress: {
    color: "#999",
    fontSize: 13,
    marginBottom: 4,
  },
  cardRent: {
    color: "#0066CC",
    fontSize: 14,
    fontWeight: "600",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#333",
  },
  pillActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  text: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  textActive: {
    color: "#000",
  },
});
