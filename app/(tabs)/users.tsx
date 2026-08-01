import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { PageContainer } from "@/components/page-container";
import { Bookmark, Heart } from "lucide-react-native";
import { useUsers } from "@/hooks/useUsers";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import TabPageHeader from "@/components/ui/TabPageHeader";
import IconCircle from "@/components/ui/IconCircle";
import FilterPills from "@/components/ui/FilterPills";
import PostPreviewCard from "@/components/listings/PostPreviewCard";
import { colors, layout, radius, spacing } from "@/src/constants/theme";

export default function UsersScreen() {
  const {
    posts,
    loading,
    activeFilter,
    setActiveFilter,
    savedPostIds,
    handleToggleSave,
    filters,
    handleNavigateToPost,
    handleNavigateToSaved,
  } = useUsers();

  if (loading) return <LoadingState label="Loading posts…" />;

  return (
    <PageContainer>
      <View style={{ flex: 1, backgroundColor: colors.background.screen, paddingTop: spacing.md }}>
        <TabPageHeader
          title="Student Posts"
          right={
            <Pressable onPress={handleNavigateToSaved}>
              <IconCircle variant="elevated" size={38}>
                <Bookmark size={18} color={colors.text.primary} strokeWidth={2} />
              </IconCircle>
            </Pressable>
          }
        />

        <View style={{ marginBottom: spacing.xl }}>
          <FilterPills
            options={filters.map((f) => ({ label: f.label, value: f.key }))}
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </View>

        {posts.length === 0 ? (
          <EmptyState
            title={activeFilter === "yourPost" ? "You haven't created any posts yet." : "No posts available."}
          />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => {
              const isSaved = savedPostIds.has(item.id);
              return (
                <PostPreviewCard
                  title={item.title}
                  body={item.body}
                  numberOfLines={3}
                  onPress={() => handleNavigateToPost(item.id)}
                  action={
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleSave(item.id);
                      }}
                      hitSlop={8}
                    >
                      <IconCircle
                        variant={isSaved ? "onWhite" : "elevated"}
                        size={32}
                        radius={radius.sm}
                        style={{ marginTop: spacing.xs / 2, flexShrink: 0 }}
                      >
                        <Heart
                          size={16}
                          color={isSaved ? colors.black : colors.text.faint}
                          fill={isSaved ? colors.black : "transparent"}
                          strokeWidth={2}
                        />
                      </IconCircle>
                    </Pressable>
                  }
                />
              );
            }}
            contentContainerStyle={{ paddingBottom: layout.navBarClearance, gap: spacing.sm - 2 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </PageContainer>
  );
}
