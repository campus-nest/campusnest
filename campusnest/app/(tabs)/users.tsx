import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useRouter } from "expo-router";
import { authService, postService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";
import Screen from "@/components/ui/Screen";
import FilterPills from "@/components/ui/FilterPills";
import { H1 } from "@/components/ui/Headings";
import LoadingState from "@/components/ui/LoadingState";
import PostCard from "@/components/posts/PostCard";

type PostFilter = "yourPost" | "recent";

const FILTER_OPTIONS = [
  { label: "Your Post", value: "yourPost" },
  { label: "Recent", value: "recent" },
]as const;

export default function UsersScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("yourPost");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    if (!currentUserId) return;
  
    const fetchSaved = async () => {
      const savedPosts = await savedPostService.getSavedPosts(currentUserId);
      setSavedPostIds(new Set(savedPosts.map((p) => p.id)));
    };
  
    fetchSaved();
  }, [currentUserId]);

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

  const handleToggleSave = async (postId: string) => {
    if (!currentUserId) return;

    const isSaved = savedPostIds.has(postId);

    if (isSaved) {
      const result = await savedPostService.unsavePost(postId, currentUserId);
      if (result.success) {
        setSavedPostIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } else {
      const result = await savedPostService.savePost(postId, currentUserId);
      if (result.success) {
        setSavedPostIds((prev) => new Set(prev).add(postId));
      }
    }
  };

  if (loading) {
    return <LoadingState label="Loading posts..." />;
  }

  return (
    <PageContainer>
      <Screen>
      {/* Header */}
      <H1 bold style={{ textAlign: "left" }}>
        Student Posts
      </H1>

      {/* Filters */}
      <FilterPills
        options={[...FILTER_OPTIONS]}
        value={activeFilter}
        onChange={(value: string) => setActiveFilter(value as PostFilter)}
      />

      {/* Content */}
      {posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {activeFilter === "yourPost"
              ? "You haven't created any posts yet"
              : "No posts available"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              saved={savedPostIds.has(item.id)}
              onPress={() => router.push(`/post/${item.id}`)}
              onToggleSave={() => handleToggleSave(item.id)}
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
});
