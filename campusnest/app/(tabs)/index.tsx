import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PageContainer } from "@/components/page-container";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";

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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      }

      setListings(fetchedListings);
      setListingsLoading(false);
    };

    fetchListings();
  }, [role, activeFilter, debouncedQuery]);

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
        <FilterPills
          options={filterOptions}
          value={activeFilter}
          onChange={setActiveFilter}
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 60,
  },
});
