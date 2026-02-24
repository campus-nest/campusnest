import { ListingCard } from "@/components/listings/ListingCard";
import { PageContainer } from "@/components/page-container";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import { useListings } from "@/src/hooks/useListings";
import { useRole } from "@/src/hooks/useRole";
import {
  sortByCreatedAtDesc,
  sortByMoveInAsc,
  sortByRentAsc,
} from "@/src/utils/listing.utils";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

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

export default function HomeScreen() {
  const { role, loading: roleLoading } = useRole();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");

  const { listings, loading: listingsLoading } = useListings(role, activeFilter);

  const filterOptions = useMemo(
    () => (role === "student" ? STUDENT_FILTERS : LANDLORD_FILTERS),
    [role],
  );

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
        // Not yet implemented — needs user location data
        return [...base].sort(sortByCreatedAtDesc);
      default:
        return base;
    }
  }, [listings, activeFilter]);

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