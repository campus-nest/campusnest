import { useEffect, useState, useRef } from "react";
import { Alert, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { geocodingService } from "@/src/services/geocoding.service";

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function useSelectLocation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    initialLat?: string;
    initialLng?: string;
    initialAddress?: string;
  }>();

  const mapRef = useRef<any>(null);

  // Parse initial values from params
  const initialLat = params.initialLat ? parseFloat(params.initialLat) : null;
  const initialLng = params.initialLng ? parseFloat(params.initialLng) : null;

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(
      initialLat && initialLng
        ? {
            latitude: initialLat,
            longitude: initialLng,
            address: params.initialAddress,
          }
        : null
    );

  const [region, setRegion] = useState<Region>({
    latitude: initialLat || 53.5232, // Default to Edmonton
    longitude: initialLng || -113.5263,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [searchQuery, setSearchQuery] = useState(params.initialAddress || "");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Request location permission and get current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      if (initialLat && initialLng) return;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setRegion(newRegion);
      } catch (error) {
        console.log("Could not get current location:", error);
      }
    };

    getCurrentLocation();
  }, [initialLat, initialLng]);

  // Handle map press to select location
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setSelectedLocation({ latitude, longitude });
    setIsLoadingAddress(true);

    try {
      const address = await geocodingService.reverseGeocode(
        latitude,
        longitude
      );
      setSelectedLocation({
        latitude,
        longitude,
        address: address || undefined,
      });
      if (address) {
        setSearchQuery(address);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Search for address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const result = await geocodingService.geocodeAddress(searchQuery);

      if (result) {
        const newRegion = {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setSelectedLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.displayName,
        });
        setSearchQuery(result.displayName);

        // Animate to the new location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 500);
        }
      } else {
        Alert.alert(
          "Not Found",
          "Could not find that address. Try a different search."
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  // Go to current location
  const handleGoToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Could not get your current location.");
    }
  };

  // Confirm selection and go back
  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert("No Location", "Please tap on the map to select a location.");
      return;
    }

    router.back();

    if (global.onLocationSelected) {
      global.onLocationSelected(selectedLocation);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    router.back();
  };

  return {
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
  };
}
