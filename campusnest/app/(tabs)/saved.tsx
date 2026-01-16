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
import { authService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";

export default function SavedPostsScreen() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);

      const session = await authService.getSession();
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const posts = await savedPostService.getSavedPosts(session.user.id);
      setSavedPosts(posts);
      setLoading(false);
    };

    fetchSavedPosts();
  }, []);

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
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading saved posts...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Posts</Text>
        </View>

        {savedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text style={styles.emptyText}>Nothing to see here</Text>
            <Text style={styles.emptySubtext}>
              Posts you save will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedPosts}
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
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
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
    gap: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cardBody: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 19,
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
});
