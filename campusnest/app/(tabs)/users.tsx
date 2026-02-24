import { PageContainer } from "@/components/page-container";
import PostCard from "@/components/posts/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import FilterPills from "@/components/ui/FilterPills";
import { H1 } from "@/components/ui/Headings";
import LoadingState from "@/components/ui/LoadingState";
import Screen from "@/components/ui/Screen";
import { useSavedPosts } from "@/src/hooks/useSavedPosts";
import { postService } from "@/src/services";
import { Post } from "@/src/types/post";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

type PostFilter = "yourPost" | "recent";

const FILTER_OPTIONS = [
  { label: "Your Post", value: "yourPost" },
  { label: "Recent", value: "recent" },
] as const;

export default function UsersScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("yourPost");
  const router = useRouter();

  const { savedPostIds, currentUserId, toggleSave } = useSavedPosts();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const allPosts = await postService.getPosts();

      const filtered =
        activeFilter === "yourPost" && currentUserId
          ? allPosts.filter((p) => p.user_id === currentUserId)
          : allPosts;

      setPosts(filtered);
      setLoading(false);
    };

    fetchPosts();
  }, [activeFilter, currentUserId]);

  if (loading) {
    return <LoadingState label="Loading posts..." />;
  }

  return (
    <PageContainer>
      <Screen>
        <H1 bold style={{ textAlign: "left" }}>
          Student Posts
        </H1>

        <FilterPills
          options={[...FILTER_OPTIONS]}
          value={activeFilter}
          onChange={(value: string) => setActiveFilter(value as PostFilter)}
        />

        {posts.length === 0 ? (
          <EmptyState
            title={
              activeFilter === "yourPost"
                ? "You haven't created any posts yet"
                : "No posts available"
            }
          />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                saved={savedPostIds.has(item.id)}
                onPress={() => router.push(`/post/${item.id}`)}
                onToggleSave={() => toggleSave(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Screen>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 60,
  },
});
