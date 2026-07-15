import React from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Phone, Mail, Copy, X, Pencil, Trash2 } from "lucide-react-native";
import { ListingImageGallery } from "@/components/listings/ListingImageGallery";
import { useListingDetail } from "@/hooks/useListingDetail";

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

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    listing,
    landlordName,
    landlordProfile,
    contactModalVisible,
    setContactModalVisible,
    isOwner,
    loading,
    deleting,
    handleContact,
    handleCall,
    handleCopyEmail,
    handleEdit,
    handleDelete,
    handleBack,
  } = useListingDetail(id);

  if (loading || !listing) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center gap-3">
        <ActivityIndicator color="#fff" size="large" />
        <Text className="text-[#aaa] text-[14px]">Loading listing…</Text>
      </SafeAreaView>
    );
  }

  if (deleting) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center gap-3">
        <ActivityIndicator color="#fff" size="large" />
        <Text className="text-[#aaa] text-[14px]">Deleting listing…</Text>
      </SafeAreaView>
    );
  }

  const hasCoordinates =
    listing.latitude != null && listing.longitude != null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-[#1a1a1a]">
        <Pressable className="w-10 h-10 rounded-full bg-[#1a1a1a] items-center justify-center" onPress={handleBack}>
          <ChevronLeft color="#fff" size={22} />
        </Pressable>
        <Text className="text-white text-[16px] font-semibold flex-1 text-center mx-2" numberOfLines={1}>
          {listing.title}
        </Text>
        {/* Owner actions in header */}
        {isOwner ? (
          <View className="flex-row gap-2 items-center">
            <Pressable className="w-9 h-9 rounded-full bg-[#1a1a1a] items-center justify-center border border-[#2a2a2a]" onPress={handleEdit} hitSlop={6}>
              <Pencil color="#fff" size={18} />
            </Pressable>
            <Pressable className="w-9 h-9 rounded-full bg-[#1a0a0a] items-center justify-center border border-[#3a1a1a]" onPress={handleDelete} hitSlop={6}>
              <Trash2 color="#ff4444" size={18} />
            </Pressable>
          </View>
        ) : (
          <View style={{ width: 40, height: 40 }} />
        )}
      </View>

      <ScrollView
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Image gallery */}
        <ListingImageGallery photos={listing.photo_urls ?? []} />

        {/* Content */}
        <View className="px-5 pt-5 gap-4">
          {/* Title + rent */}
          <Text className="text-white text-[22px] font-bold leading-[28px]">{listing.title}</Text>
          <Text className="text-white text-[26px] font-extrabold">${listing.rent}<Text className="text-[15px] font-normal text-[#888]"> / month</Text></Text>

          {/* Key details row */}
          {(listing.bedrooms != null || listing.bathrooms != null) && (
            <View className="flex-row flex-wrap gap-2">
              {listing.bedrooms != null && (
                <View className="bg-[#1a1a1a] rounded-full px-3.5 py-1.5 border border-[#2a2a2a]">
                  <Text className="text-[#ccc] text-[13px] font-medium">{listing.bedrooms} bed</Text>
                </View>
              )}
              {listing.bathrooms != null && (
                <View className="bg-[#1a1a1a] rounded-full px-3.5 py-1.5 border border-[#2a2a2a]">
                  <Text className="text-[#ccc] text-[13px] font-medium">{listing.bathrooms} bath</Text>
                </View>
              )}
              {listing.lease_term && (
                <View className="bg-[#1a1a1a] rounded-full px-3.5 py-1.5 border border-[#2a2a2a]">
                  <Text className="text-[#ccc] text-[13px] font-medium">{listing.lease_term}</Text>
                </View>
              )}
            </View>
          )}

          {/* Address */}
          <Text className="text-[#888] text-[14px] leading-[20px]">{listing.address}</Text>

          {/* Info list */}
          <View className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
            {listing.security_deposit != null && (
              <InfoRow label="Security deposit" value={`$${listing.security_deposit}`} />
            )}
            {listing.utilities && (
              <InfoRow label="Utilities" value={listing.utilities} />
            )}
            {listing.move_in_date && (
              <InfoRow
                label="Move-in date"
                value={new Date(listing.move_in_date).toLocaleDateString()}
              />
            )}
            {listing.nearby_university && (
              <InfoRow label="Nearby university" value={listing.nearby_university} last />
            )}
          </View>

          {/* Description */}
          {listing.description && (
            <View className="gap-2">
              <Text className="text-white text-[16px] font-bold">Description</Text>
              <Text className="text-[#999] text-[14px] leading-[22px]">{listing.description}</Text>
            </View>
          )}

          {/* Listed by */}
          <View className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
            <Text className="text-[#666] text-[12px] font-medium mb-1 uppercase tracking-[0.5px]">Listed by</Text>
            <Text className="text-[#e0e0e0] text-[15px] font-medium">{landlordName || "Landlord"}</Text>
          </View>

          {/* Map */}
          {hasCoordinates && MapView ? (
            <View className="h-[160px] rounded-xl overflow-hidden border border-[#2a2a2a]">
              <MapView
                className="flex-1"
                initialRegion={{
                  latitude: listing.latitude!,
                  longitude: listing.longitude!,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                {UrlTile && (
                  <UrlTile
                    urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                    tileSize={256}
                    subdomains={["a", "b", "c", "d"]}
                  />
                )}
                {Marker && (
                  <Marker
                    coordinate={{
                      latitude: listing.latitude!,
                      longitude: listing.longitude!,
                    }}
                  />
                )}
              </MapView>
            </View>
          ) : (
            <View className="h-[160px] rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] items-center justify-center">
              <Text className="text-[#555] text-[14px]">📍 No location available</Text>
            </View>
          )}

          {/* CTA button */}
          {isOwner ? (
            <View className="flex-row gap-3 mt-1">
              <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-white py-4 rounded-xl" onPress={handleEdit}>
                <Pencil color="#000" size={16} />
                <Text className="text-black text-[15px] font-bold">Edit Listing</Text>
              </Pressable>
              <Pressable className="flex-row items-center justify-center gap-1.5 bg-[#1a0a0a] py-4 px-5 rounded-xl border border-[#3a1515]" onPress={handleDelete}>
                <Trash2 color="#ff4444" size={16} />
                <Text className="text-[#ff4444] text-[15px] font-bold">Delete</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable className="bg-white py-4 rounded-xl items-center mt-1" onPress={handleContact}>
              <Text className="text-black text-[16px] font-bold">Contact landlord</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Contact Landlord Modal */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <Pressable
            className="absolute top-0 bottom-0 left-0 right-0"
            onPress={() => setContactModalVisible(false)}
          />
          <View
            className="bg-[#121212] rounded-t-[24px] p-6 border border-[#222] border-b-0"
            style={{ paddingBottom: Platform.OS === "ios" ? 40 : 24 }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-white text-[20px] font-bold">Contact Landlord</Text>
              <Pressable
                className="w-9 h-9 rounded-full bg-[#222] items-center justify-center"
                onPress={() => setContactModalVisible(false)}
              >
                <X color="#fff" size={20} />
              </Pressable>
            </View>

            <View className="mb-6">
              <Text className="text-white text-[24px] font-bold">{landlordName || "Landlord"}</Text>
              <Text className="text-[#888] text-[14px] mt-1">Interested in this property?</Text>
            </View>

            <View className="gap-4">
              {landlordProfile?.phone_number ? (
                <Pressable
                  className="flex-row items-center justify-between bg-[#1a1a1a] p-4 rounded-2xl border border-[#2a2a2a]"
                  onPress={() => handleCall(landlordProfile.phone_number!)}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#222] items-center justify-center border border-[#333]">
                      <Phone color="#fff" size={18} />
                    </View>
                    <View>
                      <Text className="text-[#666] text-[12px] font-medium">Phone Number</Text>
                      <Text className="text-white text-[14px] font-semibold mt-0.5">{landlordProfile.phone_number}</Text>
                    </View>
                  </View>
                  <Text className="text-white text-[14px] font-semibold">Call</Text>
                </Pressable>
              ) : (
                <View className="flex-row items-center justify-between bg-[#121212] p-4 rounded-2xl border border-[#1c1c1c] opacity-50">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#181818] items-center justify-center border border-[#222]">
                      <Phone color="#555" size={18} />
                    </View>
                    <View>
                      <Text className="text-[#444] text-[12px] font-medium">Phone Number</Text>
                      <Text className="text-[#666] text-[14px] font-semibold mt-0.5">Not provided</Text>
                    </View>
                  </View>
                </View>
              )}

              {landlordProfile?.email ? (
                <Pressable
                  className="flex-row items-center justify-between bg-[#1a1a1a] p-4 rounded-2xl border border-[#2a2a2a]"
                  onPress={() => handleCopyEmail(landlordProfile.email!)}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#222] items-center justify-center border border-[#333]">
                      <Mail color="#fff" size={18} />
                    </View>
                    <View>
                      <Text className="text-[#666] text-[12px] font-medium">Email Address</Text>
                      <Text className="text-white text-[14px] font-semibold mt-0.5">{landlordProfile.email}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center bg-[#2a2a2a] px-3 py-1.5 rounded-lg">
                    <Copy color="#fff" size={14} />
                  </View>
                </Pressable>
              ) : (
                <View className="flex-row items-center justify-between bg-[#121212] p-4 rounded-2xl border border-[#1c1c1c] opacity-50">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#181818] items-center justify-center border border-[#222]">
                      <Mail color="#555" size={18} />
                    </View>
                    <View>
                      <Text className="text-[#444] text-[12px] font-medium">Email Address</Text>
                      <Text className="text-[#666] text-[14px] font-semibold mt-0.5">Not provided</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={`flex-row justify-between items-center py-3 border-b border-[#2a2a2a] ${last ? 'border-b-0 pb-0' : ''}`}>
      <Text className="text-[#666] text-[13px]">{label}</Text>
      <Text className="text-[#e0e0e0] text-[13px] font-medium">{value}</Text>
    </View>
  );
}
