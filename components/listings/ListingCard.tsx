import { Pressable, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Listing } from "@/src/types/listing";
import { Bookmark } from "lucide-react-native";
import { useSavedListings } from "@/src/context/SavedListingsContext";

interface Props {
  listing: Listing;
}

export function ListingCard({ listing }: Props) {
  const router = useRouter();
  const { savedListingIds, toggleSaveListing } = useSavedListings();
  const isSaved = savedListingIds.has(listing.id);

  return (
    <Pressable
      className="flex-row bg-[#1a1a1a] rounded-xl p-3 mb-3 border border-[#2a2a2a] items-center"
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      {/* Thumbnail */}
      <View className="w-20 h-20 rounded-lg bg-[#2a2a2a] items-center justify-center mr-3 overflow-hidden shrink-0">
        {listing.photo_urls?.length ? (
          <Image
            source={{ uri: listing.photo_urls[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-[28px]">🏠</Text>
        )}
      </View>

      {/* Text content */}
      <View className="flex-1 gap-1">
        <Text className="text-white text-[14px] font-bold leading-[18px]" numberOfLines={1}>{listing.title}</Text>

        <Text className="mt-0.5">
          <Text className="text-white text-[18px] font-extrabold">${listing.rent}</Text>
          <Text className="text-[#777] text-[12px] font-normal"> /mo</Text>
        </Text>

        <View className="flex-row gap-2 mt-0.5">
          {listing.lease_term ? (
            <View className="bg-[#2a2a2a] rounded-lg px-2 py-1 border border-[#333]">
              <Text className="text-[#aaa] text-[11px] font-medium">{listing.lease_term}</Text>
            </View>
          ) : null}
          {listing.bedrooms != null ? (
            <View className="bg-[#2a2a2a] rounded-lg px-2 py-1 border border-[#333]">
              <Text className="text-[#aaa] text-[11px] font-medium">{listing.bedrooms}bd</Text>
            </View>
          ) : null}
        </View>

        <Text className="text-[#888] text-[12px] leading-[16px] mt-0.5" numberOfLines={2} ellipsizeMode="tail">
          {listing.address}
        </Text>
      </View>

      {/* Save button */}
      <Pressable
        className="pl-2 pt-0.5 self-start"
        onPress={(e) => {
          e.stopPropagation();
          toggleSaveListing(listing.id);
        }}
        hitSlop={8}
      >
        <Bookmark
          size={18}
          color={isSaved ? "#fff" : "#555"}
          fill={isSaved ? "#fff" : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}