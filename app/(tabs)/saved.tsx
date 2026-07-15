import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { Bookmark, BookmarkX } from "lucide-react-native";
import { useSaved } from "@/hooks/useSaved";
import { Post } from "@/src/types/post";
import { Listing } from "@/src/types/listing";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function SavedScreen() {
  const {
    activeTab,
    setActiveTab,
    savedPosts,
    savedListings,
    loading,
    toggleSave,
    toggleSaveListing,
    handleNavigateToListing,
    handleNavigateToPost,
  } = useSaved();

  if (loading) {
    return <LoadingState label="Loading saved…" />;
  }

  return (
    <PageContainer style={{ paddingTop: 12 }}>
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

        {/* Listings tab */}
        {activeTab === "listings" && (
          savedListings.length === 0 ? (
            <EmptyState
              label="No saved listings yet"
              subtext="Tap the bookmark on any listing to save it"
              icon={<Bookmark size={28} color="#444" strokeWidth={1.5} />}
            />
          ) : (
            <FlatList
              data={savedListings}
              keyExtractor={(l) => l.id}
              renderItem={({ item }) => (
                <SavedListingCard
                  listing={item}
                  onPress={() => handleNavigateToListing(item.id)}
                  onUnsave={() => toggleSaveListing(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        )}

        {/* Posts tab */}
        {activeTab === "posts" && (
          savedPosts.length === 0 ? (
            <EmptyState
              label="Nothing saved yet"
              subtext="Posts you save will appear here"
              icon={<Bookmark size={28} color="#444" strokeWidth={1.5} />}
            />
          ) : (
            <FlatList
              data={savedPosts}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => (
                <SavedPostCard
                  post={item}
                  onPress={() => handleNavigateToPost(item.id)}
                  onUnsave={() => toggleSave(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        )}
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
          <Image
            source={{ uri: listing.photo_urls[0] }}
            style={styles.listingThumbImage}
            resizeMode="cover"
          />
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
        <BookmarkX size={16} color="#555" strokeWidth={2} />
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
          <Bookmark size={14} color="#666" strokeWidth={2} />
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
        <BookmarkX size={16} color="#555" strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  countPill: {
    backgroundColor: "#1a1a1a",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  countText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
  },
  tabActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  tabText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#000",
  },
  listContent: {
    paddingBottom: 60,
    gap: 10,
  },
  // Listing card
  listingCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listingThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
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
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  listingRent: {},
  listingRentAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  listingRentSuffix: {
    color: "#666",
    fontSize: 12,
  },
  listingAddress: {
    color: "#666",
    fontSize: 12,
  },
  // Post card
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardLeft: {
    paddingTop: 2,
  },
  cardIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 5,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  cardText: {
    color: "#777",
    fontSize: 13,
    lineHeight: 18,
  },
  unsaveBtn: {
    paddingTop: 2,
    paddingLeft: 4,
  },
});