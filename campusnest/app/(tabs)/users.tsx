import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useFocusEffect, useRouter } from "expo-router";
import { authService, postService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Bookmark, Heart } from "lucide-react-native";
import { useSavedPosts } from "@/src/context/SavedPostsContext";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

type PostFilter = "yourPost" | "recent";

export default function UsersScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("recent");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "landlord" | null>(null);
  const { savedPostIds, toggleSave } = useSavedPosts();
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUserAndRole = async () => {
      const session = await authService.getSession();
      setCurrentUserId(session?.user?.id || null);
      const userRole = await authService.getUserRole();
      setRole(userRole);
    };
    fetchCurrentUserAndRole();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        const allPosts = await postService.getPosts();
        let filteredPosts = allPosts;
        if (activeFilter === "yourPost" && currentUserId && role !== "landlord") {
          filteredPosts = allPosts.filter((post) => post.user_id === currentUserId);
        }
        setPosts(filteredPosts);
        setLoading(false);
      };
      fetchPosts();
    }, [activeFilter, currentUserId, role])
  );

  const handleToggleSave = useCallback(
    (postId: string) => { toggleSave(postId); },
    [toggleSave]
  );

  const filters: { key: PostFilter; label: string }[] =
    role === "landlord"
      ? [{ key: "recent", label: "Recent" }]
      : [
          { key: "recent", label: "Recent" },
          { key: "yourPost", label: "Your Posts" },
        ];

  if (loading) return <LoadingState label="Loading posts…" />;

  return (
    <PageContainer>
      <View style={styles.screen}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Student Posts</Text>
          <Pressable style={styles.savedBtn} onPress={() => router.push("/(tabs)/saved")}>
            <Bookmark size={18} color={colors.text.primary} strokeWidth={2} />
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

        {posts.length === 0 ? (
          <EmptyState
            title={activeFilter === "yourPost" ? "You haven't created any posts yet." : "No posts available."}
          />
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
        <Text style={styles.cardText} numberOfLines={3}>{post.body}</Text>
      </View>
      <Pressable
        style={[styles.saveIconBtn, isSaved && styles.saveIconBtnActive]}
        onPress={(e) => { e.stopPropagation(); onToggleSave(); }}
        hitSlop={8}
      >
        <Heart
          size={16}
          color={isSaved ? colors.black : colors.text.faint}
          fill={isSaved ? colors.black : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.screen,
    paddingTop: spacing.md,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  pageTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.1,
  },
  savedBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filtersRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chipActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  chipText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  chipTextActive: {
    color: colors.black,
  },
  listContent: {
    paddingBottom: 60,
    gap: 10,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  cardBody: {
    flex: 1,
    gap: spacing.sm - 2,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: typography.weight.bold,
    lineHeight: 20,
  },
  cardText: {
    color: colors.text.secondary,
    fontSize: typography.size.base,
    lineHeight: 19,
  },
  saveIconBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  saveIconBtnActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
});
