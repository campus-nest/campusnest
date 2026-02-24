import { PageContainer } from "@/components/page-container";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { authService, savedPostService } from "@/src/services";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { Post } from "@/src/types/post";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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

  if (loading) {
    return <LoadingState label="Loading saved posts..." />;
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Posts</Text>
        </View>

        {savedPosts.length === 0 ? (
          <EmptyState
            icon="💭"
            title="Nothing to see here"
            subtitle="Posts you save will appear here"
          />
        ) : (
          <FlatList
            data={savedPosts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/post/${item.id}`)}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody} numberOfLines={4}>
                    {item.body}
                  </Text>
                </View>
              </Pressable>
            )}
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
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingTop: 10,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.h2,
    fontWeight: typography.fontWeights.bold,
  },
  listContent: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: colors.backgroundCardAlt,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardContent: {
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  cardBody: {
    color: colors.textLabel,
    fontSize: typography.fontSizes.base,
    lineHeight: typography.lineHeights.base,
  },
});
