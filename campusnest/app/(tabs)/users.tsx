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
import { authService, postService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";

type PostFilter = "yourPost" | "recent";

export default function UsersScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("yourPost");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
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
      let filteredPosts = allPosts;
      if (activeFilter === "yourPost" && currentUserId) {
        filteredPosts = allPosts.filter((post) => post.user_id === currentUserId);
      }
      setPosts(filteredPosts);

      if (currentUserId) {
        const savedPosts = await savedPostService.getSavedPosts(currentUserId);
        setSavedPostIds(new Set(savedPosts.map((p) => p.id)));
      }
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
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      }
    } else {
      const result = await savedPostService.savePost(postId, currentUserId);
      if (result.success) setSavedPostIds((prev) => new Set(prev).add(postId));
    }
  };

  const filters: { key: PostFilter; label: string }[] = [
    { key: "yourPost", label: "Your Posts" },
    { key: "recent", label: "Recent" },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading posts…</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Student Posts</Text>
          <Pressable
            style={styles.savedBtn}
            onPress={() => router.push("/(tabs)/saved")}
          >
            <Text style={styles.savedBtnIcon}>❤️</Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <View style={styles.filtersRow}>
          {filters.map((f) => {
            const active = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* List */}
        {posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeFilter === "yourPost"
                ? "You haven't created any posts yet."
                : "No posts available."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                isSaved={savedPostIds.has(item.id)}
                onPress={() => router.push(`/post/${item.id}`)}
                onToggleSave={() => handleToggleSave(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </PageContainer>
  );
}

function PostCard({
  post,
  isSaved,
  onPress,
  onToggleSave,
}: {
  post: Post;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{post.title}</Text>
        <Text style={styles.cardText} numberOfLines={3}>
          {post.body}
        </Text>
      </View>
      <Pressable
        style={styles.saveBtn}
        onPress={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        hitSlop={8}
      >
        <Text style={styles.saveIcon}>{isSaved ? "❤️" : "🤍"}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 12,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  savedBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  savedBtnIcon: {
    fontSize: 18,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  chipActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  chipText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#000",
  },
  listContent: {
    paddingBottom: 60,
    gap: 12,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  cardText: {
    color: "#888",
    fontSize: 14,
    lineHeight: 18,
  },
  saveBtn: {
    paddingTop: 2,
  },
  saveIcon: {
    fontSize: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 12,
  },
  centeredText: {
    color: "#aaa",
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});