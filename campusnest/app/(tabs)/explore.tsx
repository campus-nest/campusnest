import Screen from "@/components/ui/Screen";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { useRouter } from "expo-router";
import { Home, MapPin } from "lucide-react-native";
import { useEffect, useState, useCallback } from "react";
import FilterPills from "@/components/ui/FilterPills";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "@/src/utils/distance";
import { colors, radius, spacing, typography } from "@/src/constants/theme";
import { pillStyles } from "@/components/ui/FilterPills";
import {
  ActivityIndicator,
  Alert,
  Linking,
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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";

export default function ExploreScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"student" | "landlord" | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<StudentFilter>("new");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [debouncedMin, setDebouncedMin] = useState<number>(0);
  const [debouncedMax, setDebouncedMax] = useState<number>(5000);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Fallback to Edmonton
        setUserLocation({ latitude: 53.5461, longitude: -113.4938 });
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch {
        setUserLocation({ latitude: 53.5461, longitude: -113.4938 });
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  // Default to Edmonton (University of Alberta)
  const [region, setRegion] = useState<Region>({
    latitude: 53.5232,
    longitude: -113.5263,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const fetchListings = useCallback(async () => {
    try {
      const data = await listingService.getListings({
        status: "active",
        visibility: "public",
        minRent: debouncedMin > 0 ? debouncedMin : undefined,
        maxRent: debouncedMax < 5000 ? debouncedMax : undefined,
      });

      // Filter listings that have valid coordinates
      const listingsWithCoords = data.filter(
        (listing) =>
          listing.latitude != null &&
          listing.longitude != null &&
          !isNaN(listing.latitude) &&
          !isNaN(listing.longitude),
      );

      // Local sorting
      if (activeFilter === "cheapest") {
        listingsWithCoords.sort((a, b) => a.rent - b.rent);
      } else if (activeFilter === "new") {
        listingsWithCoords.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } else if (activeFilter === "moveIn") {
        listingsWithCoords.sort((a, b) => {
          if (!a.move_in_date) return 1;
          if (!b.move_in_date) return -1;
          return (
            new Date(a.move_in_date).getTime() -
            new Date(b.move_in_date).getTime()
          );
        });
      } else if (activeFilter === "closest" && userLocation) {
        listingsWithCoords.sort((a, b) => {
          const distA = getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            a.latitude || 0,
            a.longitude || 0,
          );
          const distB = getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            b.latitude || 0,
            b.longitude || 0,
          );
          return distA - distB;
        });
      }

      setListings(listingsWithCoords);

      // Adjust region to fit all markers if we have listings
      if (listingsWithCoords.length > 0) {
        const coords = listingsWithCoords.map((l) => ({
          latitude: l.latitude!,
          longitude: l.longitude!,
        }));

        const minLat = Math.min(...coords.map((c) => c.latitude));
        const maxLat = Math.max(...coords.map((c) => c.latitude));
        const minLng = Math.min(...coords.map((c) => c.longitude));
        const maxLng = Math.max(...coords.map((c) => c.longitude));

        setRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.02),
          longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.02),
        });
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      Alert.alert("Error", "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, userLocation, debouncedMin, debouncedMax]);

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        setLoading(true);

        // Check user role first
        const role = await authService.getUserRole();
        setUserRole(role);

        // If landlord, don't fetch listings (they shouldn't see this page)
        if (role === "landlord") {
          setLoading(false);
          return;
        }

        // Fetch listings for students
        await fetchListings();
      } catch (error) {
        console.error("Error in explore screen:", error);
        Alert.alert("Error", "Failed to load explore page");
        setLoading(false);
      }
    };

    initializeScreen();
  }, [fetchListings]);

  const handleMarkerPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const openOSMAttribution = () => {
    Linking.openURL("https://www.openstreetmap.org/copyright");
  };

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
            onPress={() => router.push("/(tabs)/")}
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
                  (minPrice > 0 || maxPrice < 5000) && pillStyles.pillActive,
                  { marginRight: spacing.sm },
                ]}
              >
                <Text
                  style={[
                    pillStyles.text,
                    (minPrice > 0 || maxPrice < 5000) && pillStyles.textActive,
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
          onApply={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
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
