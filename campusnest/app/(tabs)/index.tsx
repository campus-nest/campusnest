import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PageContainer } from "@/components/page-container";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";

type Role = "student" | "landlord";

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
type LandlordFilter = "recent" | "yourListings";
type FilterKey = StudentFilter | LandlordFilter;

const STUDENT_FILTERS: { label: string; value: StudentFilter }[] = [
  { label: "New", value: "new" },
  { label: "Closest", value: "closest" },
  { label: "Cheapest", value: "cheapest" },
  { label: "Move-In", value: "moveIn" },
];

const LANDLORD_FILTERS: { label: string; value: LandlordFilter }[] = [
  { label: "Your Listings", value: "yourListings" },
  { label: "Recent", value: "recent" },
];

// Stable helpers
const sortByCreatedAtDesc = (a: Listing, b: Listing) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

const sortByRentAsc = (a: Listing, b: Listing) =>
  (a.rent ?? Number.POSITIVE_INFINITY) - (b.rent ?? Number.POSITIVE_INFINITY);

const sortByMoveInAsc = (a: Listing, b: Listing) => {
  if (!a.move_in_date) return 1;
  if (!b.move_in_date) return -1;
  return (
    new Date(a.move_in_date).getTime() - new Date(b.move_in_date).getTime()
  );
};

export default function HomeScreen() {
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [listings, setListings] = useState<Listing[]>([]);

  // Resolve role once
  useEffect(() => {
    let cancelled = false;

    const fetchRole = async () => {
      try {
        const userRole = await authService.getUserRole();
        if (cancelled) return;

        if (userRole) {
          setRole(userRole);
          setActiveFilter(userRole === "student" ? "new" : "recent");
        } else {
          setRole(null);
        }
      } finally {
        if (!cancelled) setRoleLoading(false);
      }
    };

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch listings whenever role or filter changes
  useEffect(() => {
    if (!role) return;

    let cancelled = false;

    const fetchListings = async () => {
      setListingsLoading(true);

      try {
        const session = await authService.getSession();
        if (cancelled) return;

        let fetchedListings: Listing[] = [];

        if (role === "student") {
          // Students see public active listings
          fetchedListings = await listingService.getListings({
            status: "active",
            visibility: "public",
          });
        } else {
          // Landlord
          if (activeFilter === "yourListings") {
            const landlordId = session?.user?.id;

            // Critical guard: do NOT fall back to an unfiltered query
            if (!landlordId) {
              fetchedListings = [];
            } else {
              fetchedListings = await listingService.getListings({
                landlord_id: landlordId,
              });
            }
          } else {
            // "Recent" for landlords currently maps to public active listings
            fetchedListings = await listingService.getListings({
              status: "active",
              visibility: "public",
            });
          }
        }

        if (!cancelled) setListings(fetchedListings);
      } catch (e) {
        // Fail closed: do not show stale/incorrect listings
        if (!cancelled) setListings([]);
        console.error("Failed to fetch listings:", e);
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    };

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, [role, activeFilter]);

  // Filter options derived from role
  const filterOptions = useMemo((): { label: string; value: FilterKey }[] => {
    if (role === "student") return STUDENT_FILTERS;
    return LANDLORD_FILTERS;
  }, [role]);

  // Presentation-level sorting (client-side)
  const displayedListings = useMemo(() => {
    const base = listings ?? [];

    switch (activeFilter) {
      case "new":
        return [...base].sort(sortByCreatedAtDesc);

      case "cheapest":
        return [...base].sort(sortByRentAsc);

      case "moveIn":
        return [...base].sort(sortByMoveInAsc);

      case "closest":
        // Not implemented (needs user location + listing coordinates).
        // Keep deterministic ordering for now.
        return [...base].sort(sortByCreatedAtDesc);

      default:
        return base;
    }
  }, [listings, activeFilter]);

  // Loading states
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
        <FilterPills
          options={filterOptions}
          value={activeFilter}
          onChange={setActiveFilter}
        />

        <FlatList
          data={displayedListings}
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
  listContent: {
    paddingBottom: 60,
  },
});