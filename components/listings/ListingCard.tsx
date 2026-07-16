import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Listing } from "@/src/types/listing";
import { Bookmark } from "lucide-react-native";
import { useSavedListings } from "@/src/context/SavedListingsContext";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

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
      <View style={styles.imageWrapper}>
        {listing.photo_urls?.length ? (
          <Image source={{ uri: listing.photo_urls[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.imageFallback}>🏠</Text>
        )}
      </View>

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

      <Pressable
        style={styles.saveBtn}
        onPress={(e) => { e.stopPropagation(); toggleSaveListing(listing.id); }}
        hitSlop={8}
      >
        <Bookmark
          size={18}
          color={isSaved ? colors.white : colors.text.dim}
          fill={isSaved ? colors.white : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
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
    gap: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    lineHeight: 18,
  },
  rent: {
    marginTop: 1,
  },
  rentAmount: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
  },
  rentSuffix: {
    color: "#777",
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 2,
  },
  tag: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  tagText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  address: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    lineHeight: 16,
    marginTop: 2,
  },
  saveBtn: {
    paddingLeft: spacing.sm,
    paddingTop: 2,
    alignSelf: "flex-start",
  },
});
