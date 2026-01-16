import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PageContainer } from "@/components/page-container";
import {
  postService,
  profileService,
  commentService,
  authService,
} from "@/src/services";
import { Post } from "@/src/types/post";
import { Profile } from "@/src/types/profile";
import { CommentWithProfile } from "@/src/types/comment";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async (postId: string) => {
    const fetchedComments = await commentService.getCommentsByPostId(postId);
    setComments(fetchedComments);
  };

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

      await fetchComments(id);

      setLoading(false);
    };

    fetchPostAndCreator();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;

    const session = await authService.getSession();
    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in to comment");
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
      Alert.alert("Error", result.error || "Failed to post comment");
    }

    setSubmitting(false);
  };

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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.postCard}>
              <Text style={styles.title}>{post.title}</Text>

              <Text style={styles.body}>{post.body}</Text>

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

            <View style={styles.commentSection}>
              <Text style={styles.commentHeader}>
                Comments ({comments.length})
              </Text>

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Enter your comment"
                  placeholderTextColor="#999"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  editable={!submitting}
                />
                <Pressable
                  style={[
                    styles.submitButton,
                    (!commentText.trim() || submitting) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitComment}
                  disabled={!commentText.trim() || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Post</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.commentsList}>
                {comments.length === 0 ? (
                  <Text style={styles.noComments}>
                    No comments yet. Be the first to comment!
                  </Text>
                ) : (
                  comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {comment.profile?.full_name?.[0]?.toUpperCase() ||
                            "?"}
                        </Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>
                          {comment.profile?.full_name || "Anonymous"}
                        </Text>
                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                        <Text style={styles.commentDate}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
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
  commentInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  submitButtonDisabled: {
    backgroundColor: "#555",
  },
  submitButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  commentsList: {
    gap: 12,
  },
  noComments: {
    color: "#999",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
  commentItem: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  commentText: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentDate: {
    color: "#666",
    fontSize: 11,
  },
});
