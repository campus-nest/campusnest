import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Pressable, Text } from "react-native";
import { PageContainer } from "@/components/page-container";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "@/src/utils/distance";

type Role = "student" | "landlord";

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
type LandlordFilter = "recent" | "yourListings";
type FilterKey = StudentFilter | LandlordFilter;

export default function HomeScreen() {
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
      setDebouncedQuery(searchQuery);
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, minPrice, maxPrice]);

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

  useEffect(() => {
    if (!role) return;

    const fetchListings = async () => {
      setListingsLoading(true);
      const session = await authService.getSession();

      // Fetch listings based on role and filter
      let fetchedListings: Listing[] = [];

      if (role === "student") {
        // Students see public active listings
        fetchedListings = await listingService.getListings({
          status: "active",
          visibility: "public",
          searchQuery: debouncedQuery,
          minRent: debouncedMin > 0 ? debouncedMin : undefined,
          maxRent: debouncedMax < 5000 ? debouncedMax : undefined,
        });
      } else {
        // Landlord
        if (activeFilter === "yourListings") {
          fetchedListings = await listingService.getListings({
            landlord_id: session?.user?.id,
            searchQuery: debouncedQuery,
          });
        } else {
          // "recent" shows public listings from everyone
          fetchedListings = await listingService.getListings({
            status: "active",
            visibility: "public",
            searchQuery: debouncedQuery,
          });
        }
      }

      // Local sorting
      if (activeFilter === "cheapest") {
        fetchedListings.sort((a, b) => a.rent - b.rent);
      } else if (activeFilter === "new" || activeFilter === "recent") {
        fetchedListings.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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

  // Loading States
  if (roleLoading) {
    return <LoadingState label="Checking your role..." />;
  }

  if (!role) {
    return (
      <LoadingState
        label="No role found — please re-login."
        showSpinner={false}
      />
    );
  }

  if (listingsLoading) {
    return <LoadingState label="Loading listings..." />;
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <View style={styles.filterWrapper}>
          <FilterPills
            customPrependPill={
              role === "student" ? (
                <Pressable
                  onPress={() => setPriceModalVisible(true)}
                  style={[
                    styles.pill,
                    (minPrice > 0 || maxPrice < 5000) && styles.pillActive,
                    { marginRight: 8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      (minPrice > 0 || maxPrice < 5000) && styles.textActive,
                    ]}
                  >
                    Price
                  </Text>
                </Pressable>
              ) : null
            }
            options={filterOptions}
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

        <FlatList
          data={listings}
          keyExtractor={(listing) => listing.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 0,
    backgroundColor: "#000",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  searchContainer: {
    paddingHorizontal: 3,
    paddingTop: 3,
  },
  filterWrapper: {
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 60,
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
