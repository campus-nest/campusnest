import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useFocusEffect, useRouter } from "expo-router";
import { authService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Bookmark, BookmarkX } from "lucide-react-native";
import { useSavedPosts } from "@/src/context/SavedPostsContext";

export default function SavedPostsScreen() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [fetchingList, setFetchingList] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { savedPostIds, toggleSave, loading: contextLoading } = useSavedPosts();
  const router = useRouter();

  // Resolve the current user id once
  useEffect(() => {
    authService.getSession().then((session) => {
      setCurrentUserId(session?.user?.id ?? null);
    });
  }, []);

  // Re-fetch the full list of saved posts whenever the tab is focused
  // (or whenever savedPostIds changes — the context already keeps that in sync).
  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;
      setFetchingList(true);
      savedPostService.getSavedPosts(currentUserId).then((posts) => {
        setSavedPosts(posts);
        setFetchingList(false);
      });
    }, [currentUserId])
  );

  // Keep the displayed list pruned when the context removes a saved post
  // (e.g. unsaved from the Users screen while this tab was in the background).
  useEffect(() => {
    setSavedPosts((prev) => prev.filter((p) => savedPostIds.has(p.id)));
  }, [savedPostIds]);

  const handleUnsave = useCallback(
    async (postId: string) => {
      await toggleSave(postId);
    },
    [toggleSave]
  );

  const loading = fetchingList || contextLoading;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading saved posts…</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Saved Posts</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{savedPosts.length}</Text>
          </View>
        </View>

        {savedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Bookmark size={28} color="#444" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySubtext}>
              Posts you save will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedPosts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => (
              <SavedPostCard
                post={item}
                onPress={() => router.push(`/post/${item.id}`)}
                onUnsave={() => handleUnsave(item.id)}
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
        <Text style={styles.cardText} numberOfLines={2}>
          {post.body}
        </Text>
      </View>
      <Pressable
        style={styles.unsaveBtn}
        onPress={(e) => {
          e.stopPropagation();
          onUnsave();
        }}
        hitSlop={8}
      >
        <BookmarkX size={16} color="#555" strokeWidth={2} />
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
    gap: 10,
    marginBottom: 20,
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
  listContent: {
    paddingBottom: 60,
    gap: 10,
  },
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});