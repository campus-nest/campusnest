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
  }, [role, activeFilter, debouncedQuery, debouncedMin, debouncedMax, userLocation]);

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

  if (roleLoading) return <LoadingState label="Checking your role…" />;
  if (!role) return <LoadingState label="No role found — please re-login." showSpinner={false} />;
  if (listingsLoading) return <LoadingState label="Loading listings…" />;

  return (
    <PageContainer>
      <View style={styles.screen}>
        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Filters */}
        <View style={styles.filterWrapper}>
          <FilterPills
            customPrependPill={
              role === "student" ? (
                <Pressable
                  onPress={() => setPriceModalVisible(true)}
                  style={[styles.pricePill, priceActive && styles.pricePillActive]}
                >
                  <Text style={[styles.pricePillText, priceActive && styles.pricePillTextActive]}>
                    {priceActive ? `$${minPrice}–$${maxPrice}` : "Price"}
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
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No listings found.</Text>
            </View>
          }
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  searchWrapper: {
    paddingTop: 8,
    paddingBottom: 6,
  },
  filterWrapper: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 60,
  },
  pricePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
  },
  pricePillActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  pricePillText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  pricePillTextActive: {
    color: "#000",
  },
  emptyState: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyText: {
    color: "#555",
    fontSize: 15,
  },
});