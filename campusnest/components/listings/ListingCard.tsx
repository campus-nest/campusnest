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

      <View style={styles.content}>
        <Text style={styles.title}>{listing.title}</Text>

        <Text style={styles.meta}>Lease: {listing.lease_term}</Text>

        <Text style={styles.meta}>Rent: ${listing.rent}</Text>

        <Text style={styles.address} numberOfLines={2}>
          {listing.address}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
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
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    color: "#ddd",
    fontSize: 12,
  },
  address: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 4,
  },
});
