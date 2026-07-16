import React from "react";
import { FlatList, StyleSheet, View, Pressable, Text } from "react-native";
import { PageContainer } from "@/components/page-container";
import { ListingCard } from "@/components/listings/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import EmptyState from "@/components/ui/EmptyState";
import { useHomeListings } from "@/hooks/useHomeListings";
import { colors, spacing } from "@/src/constants/theme";
import { pillStyles } from "@/components/ui/FilterPills";

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
                  style={[pillStyles.pill, priceActive && pillStyles.pillActive, styles.pricePillMargin]}
                >
                  <Text style={[pillStyles.text, priceActive && pillStyles.textActive]}>
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
          ListEmptyComponent={<EmptyState title="No listings found." style={styles.emptyState} />}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  searchWrapper: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm - 2,
  },
  filterWrapper: {
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: 60,
  },
  pricePillMargin: {
    marginRight: spacing.sm,
  },
  emptyState: {
    paddingTop: 80,
  },
});
