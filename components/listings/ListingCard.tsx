import { Pressable, StyleSheet, Text, View, Image } from "react-native";
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
      style={styles.card}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      {/* Thumbnail */}
      <View style={styles.imageWrapper}>
        {listing.photo_urls?.length ? (
          <Image
            source={{ uri: listing.photo_urls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.imageFallback}>🏠</Text>
        )}
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>

        <Text style={styles.rent}>
          <Text style={styles.rentAmount}>${listing.rent}</Text>
          <Text style={styles.rentSuffix}> /mo</Text>
        </Text>

        <View style={styles.metaRow}>
          {listing.lease_term ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{listing.lease_term}</Text>
            </View>
          ) : null}
          {listing.bedrooms != null ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{listing.bedrooms}bd</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
          {listing.address}
        </Text>
      </View>

      {/* Save button */}
      <Pressable
        style={styles.saveBtn}
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

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  rent: {
    marginTop: 1,
  },
  rentAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  rentSuffix: {
    color: "#777",
    fontSize: 12,
    fontWeight: "400",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  tagText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "500",
  },
  address: {
    color: "#888",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  saveBtn: {
    paddingLeft: 8,
    paddingTop: 2,
    alignSelf: "flex-start",
  },
});