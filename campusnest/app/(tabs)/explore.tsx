import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { useRouter } from "expo-router";
import Screen from "@/components/ui/Screen";
import { listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { Home, MapPin } from "lucide-react-native";

export default function ExploreScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);

  // Default to Edmonton (you can change this to your campus location)
  const [region, setRegion] = useState<Region>({
    latitude: 53.5232, // University of Alberta
    longitude: -113.5263,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getListings({
        status: "active",
        visibility: "public",
      });

      // Filter listings that have valid coordinates
      const listingsWithCoords = data.filter(
        (listing) =>
          listing.latitude != null &&
          listing.longitude != null &&
          !isNaN(listing.latitude) &&
          !isNaN(listing.longitude)
      );

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
  };

  const handleMarkerPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

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

  return (
    <Screen>
      <View style={styles.container}>
        {/* Map View */}
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          toolbarEnabled={false}
        >
          {listings.map((listing) => (
            <Marker
              key={listing.id}
              coordinate={{
                latitude: listing.latitude!,
                longitude: listing.longitude!,
              }}
              title={listing.title}
              description={`$${listing.rent}/month`}
              onPress={() => handleMarkerPress(listing.id)}
            >
              {/* Custom marker */}
              <View style={styles.customMarker}>
                <View style={styles.markerContent}>
                  <Home size={16} color="#000" />
                </View>
                <View style={styles.markerArrow} />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Listing count badge */}
        {listings.length > 0 && (
          <View style={styles.countBadge}>
            <MapPin size={14} color="#fff" />
            <Text style={styles.countText}>
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* No listings message */}
        {listings.length === 0 && (
          <View style={styles.noListingsOverlay}>
            <View style={styles.noListingsCard}>
              <Home size={32} color="#999" />
              <Text style={styles.noListingsTitle}>No listings available</Text>
              <Text style={styles.noListingsText}>
                Check back later for new rental opportunities
              </Text>
            </View>
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
  countBadge: {
    position: "absolute",
    top: 16,
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
    bottom: 24,
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
  noListingsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    pointerEvents: "none",
  },
  noListingsCard: {
    backgroundColor: "#1a1a1a",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 280,
  },
  noListingsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  noListingsText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});