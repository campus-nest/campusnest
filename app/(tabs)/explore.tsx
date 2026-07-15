import React from "react";
import Screen from "@/components/ui/Screen";
import { Home, MapPin } from "lucide-react-native";
import FilterPills from "@/components/ui/FilterPills";
import PriceRangeModal from "@/components/ui/PriceRangeModal";
import LoadingState from "@/components/ui/LoadingState";
import { useExplore } from "@/hooks/useExplore";
import {
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

// Dynamic imports for platform-specific map components
let MapView: any;
let Marker: any;
let UrlTile: any;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  UrlTile = maps.UrlTile;
}

export default function ExploreScreen() {
  const {
    listings,
    loading,
    userRole,
    mapReady,
    setMapReady,
    activeFilter,
    setActiveFilter,
    minPrice,
    maxPrice,
    isPriceModalVisible,
    setPriceModalVisible,
    region,
    fetchListings,
    handleMarkerPress,
    openOSMAttribution,
    handleApplyPrice,
    handleGoHome,
    priceActive,
  } = useExplore();

  // If landlord, show message that this page is for students only
  if (!loading && userRole === "landlord") {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center px-8">
          <Home size={48} color="#666" />
          <Text className="text-white text-[20px] font-bold mt-4 mb-2">Explore is for Students</Text>
          <Text className="text-[#999] text-[14px] text-center leading-[20px]">
            This map view is only available for student accounts. Use the home
            tab to manage your listings.
          </Text>
          <Pressable
            className="mt-6 bg-white px-6 py-3 rounded-full"
            onPress={handleGoHome}
          >
            <Text className="text-black text-[14px] font-semibold">Go to Home</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (loading) {
    return <LoadingState label="Loading listings..." />;
  }

  // Web fallback - show list view instead
  if (Platform.OS === "web") {
    return (
      <Screen>
        <View className="flex-1 relative">
          <View className="p-4 bg-[#1a1a1a] border-b border-[#333]">
            <Text className="text-white text-[20px] font-bold mb-2">Nearby Listings</Text>
            <FilterPills
              options={[
                { label: "New", value: "new" },
                { label: "Closest", value: "closest" },
                { label: "Cheapest", value: "cheapest" },
                { label: "Move-In", value: "moveIn" },
              ]}
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </View>

          <View className="flex-1 p-4">
            {listings.map((listing) => (
              <Pressable
                key={listing.id}
                className="flex-row bg-[#1a1a1a] rounded-xl p-4 mb-3 items-center"
                onPress={() => handleMarkerPress(listing.id)}
              >
                <View className="w-[50px] h-[50px] rounded-full bg-white justify-center items-center mr-4">
                  <Home size={24} color="#0066CC" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-[16px] font-semibold mb-1">{listing.title}</Text>
                  <Text className="text-[#999] text-[13px] mb-1">{listing.address}</Text>
                  <Text className="text-[#0066CC] text-[14px] font-semibold">${listing.rent}/month</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable className="absolute bottom-[80px] right-4 bg-white w-12 h-12 rounded-full justify-center items-center shadow-md" onPress={fetchListings}>
            <Text className="text-[24px] text-black">↻</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Native mobile map view
  return (
    <Screen noPadding>
      <View className="flex-1 relative">
        {MapView && (
          <MapView
            className="flex-1 w-full h-full"
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            toolbarEnabled={false}
            onMapReady={() => setMapReady(true)}
          >
            {/* Use Stadia Maps (free tier, no User-Agent required) */}
            {/* Alternative: CartoDB tiles - no registration needed */}
            {UrlTile && (
              <UrlTile
                urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                tileSize={256}
                subdomains={["a", "b", "c", "d"]}
              />
            )}

            {/* Listing markers */}
            {mapReady &&
              Marker &&
              listings.map((listing, index) => {
                const isTopMatch = index === 0;
                return (
                  <Marker
                    key={listing.id}
                    coordinate={{
                      latitude: listing.latitude!,
                      longitude: listing.longitude!,
                    }}
                    title={listing.title}
                    description={`$${listing.rent}/month`}
                    onPress={() => handleMarkerPress(listing.id)}
                    zIndex={isTopMatch ? 999 : 1}
                  >
                    {/* Custom marker */}
                    <View className="items-center">
                      <View
                        className={`bg-white rounded-[20px] w-10 h-10 justify-center items-center border-[3px] border-[#0066CC] shadow-md ${
                          isTopMatch ? "bg-[#0066CC] border-[#003366] scale-125 shadow-lg" : ""
                        }`}
                      >
                        <Home size={16} color={isTopMatch ? "#fff" : "#000"} />
                      </View>
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          backgroundColor: "transparent",
                          borderStyle: "solid",
                          borderLeftWidth: 6,
                          borderRightWidth: 6,
                          borderTopWidth: 10,
                          borderLeftColor: "transparent",
                          borderRightColor: "transparent",
                          borderTopColor: isTopMatch ? "#0066CC" : "#0066CC",
                          marginTop: isTopMatch ? -2 : -1,
                          transform: isTopMatch ? [{ scale: 1.2 }] : [],
                        }}
                      />
                    </View>
                  </Marker>
                );
              })}
          </MapView>
        )}

        <View className="absolute top-3 left-0 right-0 z-10">
          <FilterPills
            customPrependPill={
              <Pressable
                onPress={() => setPriceModalVisible(true)}
                className={`px-3.5 py-2 rounded-full border mr-2 ${
                  priceActive ? "bg-white border-white" : "bg-black border-[#333]"
                }`}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    priceActive ? "text-black" : "text-white"
                  }`}
                >
                  Price
                </Text>
              </Pressable>
            }
            options={[
              { label: "New", value: "new" },
              { label: "Closest", value: "closest" },
              { label: "Cheapest", value: "cheapest" },
              { label: "Move-In", value: "moveIn" },
            ]}
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

        {/* Attribution for CartoDB */}
        <Pressable className="absolute bottom-2 left-2 bg-white/70 px-1.5 py-1 rounded" onPress={openOSMAttribution}>
          <Text className="text-[10px] text-black">© OpenStreetMap | © CARTO</Text>
        </Pressable>

        {/* Listing count badge */}
        {listings.length > 0 && (
          <View className="absolute bottom-[140px] right-4 bg-black/80 px-3 py-2 rounded-[20px] flex-row items-center gap-1.5">
            <MapPin size={14} color="#fff" />
            <Text className="text-white text-[12px] font-semibold">
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* Refresh button */}
        <Pressable className="absolute bottom-[80px] right-4 bg-white w-12 h-12 rounded-full justify-center items-center shadow-md" onPress={fetchListings}>
          <Text className="text-[24px] text-black">↻</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
