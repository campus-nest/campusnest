import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import {
  authService,
  commentService,
  postService,
  profileService,
} from "@/src/services";
import { Post } from "@/src/types/post";
import { Profile } from "@/src/types/profile";
import { CommentWithProfile } from "@/src/types/comment";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async (postId: string) => {
    const fetched = await commentService.getCommentsByPostId(postId);
    setComments(fetched);
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      const postData = await postService.getPostById(id);
      if (!postData) {
        setLoading(false);
        return;
      }
      setPost(postData);
      const creatorProfile = await profileService.getProfileById(postData.user_id);
      setCreator(creatorProfile);
      await fetchComments(id);
      setLoading(false);
    };

    load();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;
    const session = await authService.getSession();
    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in to comment.");
      return;
    }

    setSubmitting(true);
    const result = await commentService.createComment({
      post_id: id,
      user_id: session.user.id,
      content: commentText.trim(),
    });

    if (result.success) {
      setCommentText("");
      await fetchComments(id);
    } else {
      Alert.alert("Error", result.error || "Failed to post comment.");
    }
    setSubmitting(false);
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.loadingText}>Loading post…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={22} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>Post</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post card */}
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody}>{post.body}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.postAuthor}>
                {creator?.full_name || "Unknown"}
              </Text>
              <Text style={styles.postDate}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Comments section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>
              Comments{comments.length > 0 ? ` (${comments.length})` : ""}
            </Text>

            {/* Comment input */}
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment…"
                placeholderTextColor="#555"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                editable={!submitting}
              />
              <Pressable
                style={[
                  styles.postBtn,
                  (!commentText.trim() || submitting) && styles.postBtnDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.postBtnText}>Post</Text>
                )}
              </Pressable>
            </View>

            {/* Comments list */}
            {comments.length === 0 ? (
              <Text style={styles.noComments}>
                No comments yet — be the first!
              </Text>
            ) : (
              <View style={styles.commentsList}>
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>
                        {comment.profile?.full_name?.[0]?.toUpperCase() || "?"}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {comment.profile?.full_name || "Anonymous"}
                        </Text>
                        <Text style={styles.commentDate}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{comment.content}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  postCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 12,
  },
  postTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  postBody: {
    color: "#bbb",
    fontSize: 14,
    lineHeight: 22,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postAuthor: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  postDate: {
    color: "#555",
    fontSize: 12,
  },
  commentsSection: {
    gap: 16,
  },
  commentsSectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  commentInputRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    minHeight: 52,
    maxHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  postBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  postBtnDisabled: {
    backgroundColor: "#222",
  },
  postBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  noComments: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 24,
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  commentAvatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthor: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  commentDate: {
    color: "#555",
    fontSize: 11,
  },
  commentText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 19,
  },
});