import React from "react";
import { FlatList, View } from "react-native";
import { PageContainer } from "@/components/page-container";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import EmptyState from "@/components/ui/EmptyState";
import PriceFilterPill from "@/components/ui/PriceFilterPill";
import { useHomeListings } from "@/hooks/useHomeListings";
import { spacing } from "@/src/constants/theme";

export default function HomeScreen() {
  const {
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
  } = useHomeListings();

  if (roleLoading) return <LoadingState label="Checking your role…" />;
  if (!role) return <LoadingState label="No role found — please re-login." showSpinner={false} />;
  if (listingsLoading) return <LoadingState label="Loading listings…" />;

  return (
    <PageContainer>
      <View style={{ flex: 1 }}>
        <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.sm - 2 }}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <View style={{ marginBottom: spacing.sm }}>
          <FilterPills
            customPrependPill={
              role === "student" ? (
                <PriceFilterPill
                  label={priceActive ? `$${minPrice}–$${maxPrice}` : "Price"}
                  active={priceActive}
                  onPress={() => setPriceModalVisible(true)}
                />
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
          onApply={handleApplyPrice}
        />

        <FlatList
          data={listings}
          keyExtractor={(listing) => listing.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={{ paddingBottom: spacing.massive }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title="No listings found." offsetTop={spacing.giant} />}
        />
      </View>
    </PageContainer>
  );
}
