import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { Bookmark, Heart } from "lucide-react-native";
import { useUsers } from "@/hooks/useUsers";
import { Post } from "@/src/types/post";

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
            onPress={handleNavigateToSaved}
          >
            <Bookmark size={18} color="#fff" strokeWidth={2} />
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
                onPress={() => handleNavigateToPost(item.id)}
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
        style={[styles.saveIconBtn, isSaved && styles.saveIconBtnActive]}
        onPress={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        hitSlop={8}
      >
        <Heart
          size={16}
          color={isSaved ? "#000" : "#666"}
          fill={isSaved ? "#000" : "transparent"}
          strokeWidth={2}
        />
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
    gap: 10,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e1e1e",
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
    fontSize: 13,
    lineHeight: 19,
  },
  saveIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  saveIconBtnActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
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