import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Listing } from "@/src/types/listing";

interface Props {
  listing: Listing;
}

export function ListingCard({ listing }: Props) {
  const router = useRouter();

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

        {/* Rent — most important, show prominently */}
        <Text style={styles.rent}>
          <Text style={styles.rentAmount}>${listing.rent}</Text>
          <Text style={styles.rentSuffix}> /mo</Text>
        </Text>

        {/* Secondary info row */}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 11,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    alignItems: "center",
  },
  imageWrapper: {
    width: 86,
    height: 86,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
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
    fontSize: 13,
    fontWeight: "400",
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#1e1e1e",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tagText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "500",
  },
  address: {
    color: "#555",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});