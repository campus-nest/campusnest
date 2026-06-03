import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { getDistanceFromLatLonInKm } from "@/src/utils/distance";

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";

export function useExplore() {
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

  // Default to Edmonton (University of Alberta)
  const [region, setRegion] = useState<Region>({
    latitude: 53.5232,
    longitude: -113.5263,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Get user location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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

  // Debouncing for price range
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

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
          !isNaN(listing.longitude)
      );

      // Local sorting
      if (activeFilter === "cheapest") {
        listingsWithCoords.sort((a, b) => a.rent - b.rent);
      } else if (activeFilter === "new") {
        listingsWithCoords.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
            a.longitude || 0
          );
          const distB = getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            b.latitude || 0,
            b.longitude || 0
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

  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleGoHome = () => {
    router.push("/(tabs)");
  };

  const priceActive = minPrice > 0 || maxPrice < 5000;

  return {
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
  };
}
