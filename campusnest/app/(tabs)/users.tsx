import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useRouter } from "expo-router";
import { authService, postService } from "@/src/services";
import { Post } from "@/src/types/post";

type PostFilter = "yourPost" | "recent";

export default function UsersScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("yourPost");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await authService.getSession();
      setCurrentUserId(session?.user?.id || null);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const allPosts = await postService.getPosts();

      // Filter posts based on active filter
      let filteredPosts = allPosts;
      if (activeFilter === "yourPost" && currentUserId) {
        filteredPosts = allPosts.filter((post) => post.user_id === currentUserId);
      }

      setPosts(filteredPosts);
      setLoading(false);
    };

    fetchPosts();
  }, [activeFilter, currentUserId]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backButton}>←</Text>
      </Pressable>
      <Pressable style={styles.iconButton}>
        <Text style={styles.iconText}>🔔</Text>
      </Pressable>
    </View>
  );

  const renderFilters = () => {
    const filters: { key: PostFilter; label: string }[] = [
      { key: "yourPost", label: "Your Post" },
      { key: "recent", label: "Recent" },
    ];

    return (
      <View style={styles.filtersRow}>
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              {isActive && <Text style={styles.checkmark}>✓ </Text>}
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderPostCard = (post: Post) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{post.title}</Text>
        <Text style={styles.cardBody} numberOfLines={4}>
          {post.body}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>👍</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push(`/post/${post.id}`)}
        >
          <Text style={styles.actionIcon}>→</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        {renderHeader()}
        {renderFilters()}

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
            renderItem={({ item }) => renderPostCard(item)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  filterChipActive: {
    backgroundColor: "#333",
  },
  filterChipText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardBody: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 19,
  },
  cardActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
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