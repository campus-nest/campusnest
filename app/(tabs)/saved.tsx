import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { PageContainer } from "@/components/page-container";
import { Bookmark, BookmarkX } from "lucide-react-native";
import { useSaved } from "@/hooks/useSaved";
import { Listing } from "@/src/types/listing";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import IconCircle from "@/components/ui/IconCircle";
import TabPageHeader from "@/components/ui/TabPageHeader";
import FilterPills from "@/components/ui/FilterPills";
import PostPreviewCard from "@/components/listings/PostPreviewCard";
import { colors, layout, radius, spacing, typography } from "@/src/constants/theme";

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

  if (loading) return <LoadingState label="Loading saved…" />;

  return (
    <PageContainer>
      <View style={{ flex: 1, backgroundColor: colors.background.screen, paddingTop: spacing.md }}>
        <TabPageHeader
          title="Saved"
          inline
          right={
            <View
              style={{
                backgroundColor: colors.background.elevated,
                borderRadius: radius.full,
                paddingHorizontal: spacing.md - 2,
                paddingVertical: spacing.xs - 1,
                borderWidth: 1,
                borderColor: colors.border.default,
              }}
            >
              <Text style={{ color: colors.text.faint, fontSize: typography.size.base, fontWeight: typography.weight.semibold }}>
                {activeTab === "listings" ? savedListings.length : savedPosts.length}
              </Text>
            </View>
          }
        />

        <View style={{ marginBottom: spacing.lg }}>
          <FilterPills
            options={[
              { label: "Listings", value: "listings" },
              { label: "Posts", value: "posts" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {activeTab === "listings" && (
          savedListings.length === 0 ? (
            <EmptyState
              title="No saved listings yet"
              subtitle="Tap the bookmark on any listing to save it"
              icon={<Bookmark size={28} color={colors.text.disabled} strokeWidth={1.5} />}
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
              contentContainerStyle={{ paddingBottom: layout.navBarClearance, gap: spacing.sm - 2 }}
              showsVerticalScrollIndicator={false}
            />
          )
        )}

        {activeTab === "posts" && (
          savedPosts.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              subtitle="Posts you save will appear here"
              icon={<Bookmark size={28} color={colors.text.disabled} strokeWidth={1.5} />}
            />
          ) : (
            <FlatList
              data={savedPosts}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => (
                <PostPreviewCard
                  title={item.title}
                  body={item.body}
                  onPress={() => handleNavigateToPost(item.id)}
                  icon={
                    <IconCircle variant="elevated" size={30} radius={radius.sm}>
                      <Bookmark size={14} color={colors.text.faint} strokeWidth={2} />
                    </IconCircle>
                  }
                  action={
                    <Pressable
                      style={{ paddingTop: spacing.xs - 2, paddingLeft: spacing.xs }}
                      onPress={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                      hitSlop={8}
                    >
                      <BookmarkX size={16} color={colors.text.dim} strokeWidth={2} />
                    </Pressable>
                  }
                />
              )}
              contentContainerStyle={{ paddingBottom: layout.navBarClearance, gap: spacing.sm - 2 }}
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
    <Pressable
      style={{
        backgroundColor: colors.background.card,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radius.md - 2,
          backgroundColor: colors.background.surface,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {listing.photo_urls?.length ? (
          <Image source={{ uri: listing.photo_urls[0] }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <Text style={{ fontSize: typography.size.display - 8 }}>🏠</Text>
        )}
      </View>
      <View style={{ flex: 1, gap: spacing.xs - 1 }}>
        <Text
          style={{ color: colors.text.primary, fontSize: typography.size.md, fontWeight: typography.weight.bold, lineHeight: 18 }}
          numberOfLines={1}
        >
          {listing.title}
        </Text>
        <Text>
          <Text style={{ color: colors.text.primary, fontSize: typography.size.lg, fontWeight: typography.weight.extrabold }}>
            ${listing.rent}
          </Text>
          <Text style={{ color: colors.text.faint, fontSize: typography.size.sm }}> /mo</Text>
        </Text>
        <Text style={{ color: colors.text.faint, fontSize: typography.size.sm }} numberOfLines={1}>
          {listing.address}
        </Text>
      </View>
      <Pressable
        style={{ paddingTop: spacing.xs - 2, paddingLeft: spacing.xs }}
        onPress={(e) => { e.stopPropagation(); onUnsave(); }}
        hitSlop={8}
      >
        <BookmarkX size={16} color={colors.text.dim} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}
