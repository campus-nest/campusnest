import { useEffect, useState } from "react";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "@/src/utils/distance";

export type Role = "student" | "landlord";
export type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
export type LandlordFilter = "recent" | "yourListings";
export type FilterKey = StudentFilter | LandlordFilter;

export function useHomeListings() {
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [debouncedMin, setDebouncedMin] = useState<number>(0);
  const [debouncedMax, setDebouncedMax] = useState<number>(5000);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Request foreground permissions and user location on mount
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

  // Debouncing for search query and price range
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, minPrice, maxPrice]);

  // Fetch the current user role on mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await authService.getUserRole();
        if (userRole) {
          setRole(userRole);
          setActiveFilter(userRole === "student" ? "new" : "recent");
        }
      } finally {
        setRoleLoading(false);
      }
    };
    fetchRole();
  }, []);

  // Fetch and sort listings based on active filters and location
  useEffect(() => {
    if (!role) return;

    const fetchListings = async () => {
      setListingsLoading(true);
      const session = await authService.getSession();
      let fetchedListings: Listing[] = [];

      if (role === "student") {
        fetchedListings = await listingService.getListings({
          status: "active",
          visibility: "public",
          searchQuery: debouncedQuery,
          minRent: debouncedMin > 0 ? debouncedMin : undefined,
          maxRent: debouncedMax < 5000 ? debouncedMax : undefined,
        });
      } else {
        if (activeFilter === "yourListings") {
          fetchedListings = await listingService.getListings({
            landlord_id: session?.user?.id,
            searchQuery: debouncedQuery,
          });
        } else {
          fetchedListings = await listingService.getListings({
            status: "active",
            visibility: "public",
            searchQuery: debouncedQuery,
          });
        }
      }

      if (activeFilter === "cheapest") {
        fetchedListings.sort((a, b) => a.rent - b.rent);
      } else if (activeFilter === "new" || activeFilter === "recent") {
        fetchedListings.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (activeFilter === "moveIn") {
        fetchedListings.sort((a, b) => {
          if (!a.move_in_date) return 1;
          if (!b.move_in_date) return -1;
          return (
            new Date(a.move_in_date).getTime() -
            new Date(b.move_in_date).getTime()
          );
        });
      } else if (activeFilter === "closest" && userLocation) {
        fetchedListings.sort((a, b) => {
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

      setListings(fetchedListings);
      setListingsLoading(false);
    };

    fetchListings();
  }, [
    role,
    activeFilter,
    debouncedQuery,
    debouncedMin,
    debouncedMax,
    userLocation,
  ]);

  const filterOptions: { label: string; value: FilterKey }[] =
    role === "student"
      ? [
          { label: "New", value: "new" },
          { label: "Closest", value: "closest" },
          { label: "Cheapest", value: "cheapest" },
          { label: "Move-In", value: "moveIn" },
        ]
      : [
          { label: "Your Listings", value: "yourListings" },
          { label: "Recent", value: "recent" },
        ];

  const priceActive = minPrice > 0 || maxPrice < 5000;

  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return {
    role,
    roleLoading,
    listingsLoading,
    activeFilter,
    setActiveFilter,
    listings,
    searchQuery,
    setSearchQuery,
    minPrice,
    maxPrice,
    isPriceModalVisible,
    setPriceModalVisible,
    priceActive,
    filterOptions,
    handleApplyPrice,
  };
}
