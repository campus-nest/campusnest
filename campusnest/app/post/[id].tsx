import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageContainer } from "@/components/page-container";
import { postService, profileService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Profile } from "@/src/types/profile";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPostAndCreator = async () => {
      setLoading(true);

      const postData = await postService.getPostById(id);

      if (!postData) {
        console.error("Post not found");
        setLoading(false);
        return;
      }

      setPost(postData);

      // Fetch creator profile
      const creatorProfile = await profileService.getProfileById(
        postData.user_id,
      );
      setCreator(creatorProfile);

      setLoading(false);
    };

    fetchPostAndCreator();
  }, [id]);

  if (loading || !post) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading post...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </Pressable>
          </View>

          {/* Post Content Card */}
          <View style={styles.postCard}>
            <Text style={styles.title}>{post.title}</Text>

            <Text style={styles.body}>{post.body}</Text>

            {/* Post Actions */}
            <View style={styles.actions}>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionIcon}>👍</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionIcon}>←</Text>
              </Pressable>
            </View>

            {/* Creator Info */}
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorLabel}>Posted by:</Text>
              <Text style={styles.creatorName}>
                {creator?.full_name || "Unknown User"}
              </Text>
              <Text style={styles.date}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>Comment</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Enter your comment"
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />

            {/* Mock Comments */}
            <View style={styles.commentsList}>
              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <Text style={styles.commentText}>
                  Comment.......Comment.......
                </Text>
              </View>

              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <Text style={styles.commentText}>
                  Comment.......Comment.......
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  postCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  body: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    marginBottom: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creatorLabel: {
    color: "#999",
    fontSize: 12,
  },
  creatorName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  date: {
    color: "#999",
    fontSize: 11,
    marginLeft: "auto",
  },
  commentSection: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
  },
  commentHeader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    minHeight: 60,
    marginBottom: 20,
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    padding: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  commentText: {
    color: "#ddd",
    fontSize: 13,
    flex: 1,
  },
});
