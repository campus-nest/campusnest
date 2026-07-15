import React from "react";
import { FlatList, View, Pressable, Text } from "react-native";
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
      {/* Search */}
      <View className="pt-2 pb-[6px]">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Filters */}
      <View className="mb-2">
        <FilterPills
          customPrependPill={
            role === "student" ? (
              <Pressable
                onPress={() => setPriceModalVisible(true)}
                className={`px-4 py-2 rounded-full border mr-2 ${
                  priceActive ? "bg-white border-white" : "bg-black border-[#333]"
                }`}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    priceActive ? "text-black" : "text-white"
                  }`}
                >
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
        contentContainerClassName="pb-[60px]"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="pt-[80px] items-center">
            <Text className="text-[#555] text-[15px]">No listings found.</Text>
          </View>
        }
      />
    </PageContainer>
  );
}