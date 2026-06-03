import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useFocusEffect, useRouter } from "expo-router";
import { authService, savedListingService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Listing } from "@/src/types/listing";
import { Bookmark, BookmarkX } from "lucide-react-native";
import { useSavedPosts } from "@/src/context/SavedPostsContext";
import { useSavedListings } from "@/src/context/SavedListingsContext";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

type Tab = "listings" | "posts";

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { savedPostIds, toggleSave, loading: postsContextLoading } = useSavedPosts();
  const { savedListingIds, toggleSaveListing, loading: listingsContextLoading } = useSavedListings();
  const router = useRouter();

  useEffect(() => {
    authService.getSession().then((session) => {
      setCurrentUserId(session?.user?.id ?? null);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;
      setFetchingPosts(true);
      savedPostService.getSavedPosts(currentUserId).then((posts) => {
        setSavedPosts(posts);
        setFetchingPosts(false);
      });
      setFetchingListings(true);
      savedListingService.getSavedListings(currentUserId).then((listings) => {
        setSavedListings(listings);
        setFetchingListings(false);
      });
    }, [currentUserId])
  );

  useEffect(() => {
    setSavedPosts((prev) => prev.filter((p) => savedPostIds.has(p.id)));
  }, [savedPostIds]);

  useEffect(() => {
    setSavedListings((prev) => prev.filter((l) => savedListingIds.has(l.id)));
  }, [savedListingIds]);

  const loading =
    activeTab === "listings"
      ? fetchingListings || listingsContextLoading
      : fetchingPosts || postsContextLoading;

  if (loading) return <LoadingState label="Loading saved…" />;

  return (
    <PageContainer>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Saved</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {activeTab === "listings" ? savedListings.length : savedPosts.length}
            </Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, activeTab === "listings" && styles.tabActive]}
            onPress={() => setActiveTab("listings")}
          >
            <Text style={[styles.tabText, activeTab === "listings" && styles.tabTextActive]}>
              Listings
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "posts" && styles.tabActive]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.tabTextActive]}>
              Posts
            </Text>
          </Pressable>
        </View>

        {activeTab === "listings" && (
          savedListings.length === 0 ? (
            <EmptyState
              title="No saved listings yet"
              subtitle="Tap the bookmark on any listing to save it"
              icon={<Bookmark size={28} color="#444" strokeWidth={1.5} />}
            />
          ) : (
            <FlatList
              data={savedListings}
              keyExtractor={(l) => l.id}
              renderItem={({ item }) => (
                <SavedListingCard
                  listing={item}
                  onPress={() => router.push(`/listing/${item.id}`)}
                  onUnsave={() => toggleSaveListing(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        )}

        {activeTab === "posts" && (
          savedPosts.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              subtitle="Posts you save will appear here"
              icon={<Bookmark size={28} color="#444" strokeWidth={1.5} />}
            />
          ) : (
            <FlatList
              data={savedPosts}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => (
                <SavedPostCard
                  post={item}
                  onPress={() => router.push(`/post/${item.id}`)}
                  onUnsave={() => toggleSave(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        )}
      </View>
    </PageContainer>
  );
}

function SavedListingCard({
  listing,
  onPress,
  onUnsave,
}: {
  listing: Listing;
  onPress: () => void;
  onUnsave: () => void;
}) {
  return (
    <Pressable style={styles.listingCard} onPress={onPress}>
      <View style={styles.listingThumb}>
        {listing.photo_urls?.length ? (
          <Image source={{ uri: listing.photo_urls[0] }} style={styles.listingThumbImage} resizeMode="cover" />
        ) : (
          <Text style={styles.listingThumbFallback}>🏠</Text>
        )}
      </View>
      <View style={styles.listingBody}>
        <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.listingRent}>
          <Text style={styles.listingRentAmount}>${listing.rent}</Text>
          <Text style={styles.listingRentSuffix}> /mo</Text>
        </Text>
        <Text style={styles.listingAddress} numberOfLines={1}>{listing.address}</Text>
      </View>
      <Pressable
        style={styles.unsaveBtn}
        onPress={(e) => { e.stopPropagation(); onUnsave(); }}
        hitSlop={8}
      >
        <BookmarkX size={16} color={colors.text.dim} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

function SavedPostCard({
  post,
  onPress,
  onUnsave,
}: {
  post: Post;
  onPress: () => void;
  onUnsave: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardLeft}>
        <View style={styles.cardIconWrap}>
          <Bookmark size={14} color={colors.text.faint} strokeWidth={2} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{post.title}</Text>
        <Text style={styles.cardText} numberOfLines={2}>{post.body}</Text>
      </View>
      <Pressable
        style={styles.unsaveBtn}
        onPress={(e) => { e.stopPropagation(); onUnsave(); }}
        hitSlop={8}
      >
        <BookmarkX size={16} color={colors.text.dim} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.screen,
    paddingTop: spacing.md,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: spacing.lg,
  },
  pageTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.1,
  },
  countPill: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  countText: {
    color: colors.text.faint,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.dim,
  },
  tabActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  tabText: {
    color: colors.text.faint,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  tabTextActive: {
    color: colors.black,
  },
  listContent: {
    paddingBottom: 60,
    gap: 10,
  },
  listingCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  listingThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  listingThumbImage: {
    width: "100%",
    height: "100%",
  },
  listingThumbFallback: {
    fontSize: 24,
  },
  listingBody: {
    flex: 1,
    gap: 3,
  },
  listingTitle: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    lineHeight: 18,
  },
  listingRent: {},
  listingRentAmount: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.extrabold,
  },
  listingRentSuffix: {
    color: colors.text.faint,
    fontSize: typography.size.sm,
  },
  listingAddress: {
    color: colors.text.faint,
    fontSize: typography.size.sm,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  cardLeft: {
    paddingTop: 2,
  },
  cardIconWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.dim,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 5,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: typography.weight.bold,
    lineHeight: 20,
  },
  cardText: {
    color: "#777",
    fontSize: typography.size.base,
    lineHeight: 18,
  },
  unsaveBtn: {
    paddingTop: 2,
    paddingLeft: spacing.xs,
  },
});
