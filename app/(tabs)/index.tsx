import React from "react";
import { FlatList, StyleSheet, View, Pressable, Text } from "react-native";
import { PageContainer } from "@/components/page-container";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import { useHomeListings } from "@/hooks/useHomeListings";

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
          onApply={handleApplyPrice}
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