import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react-native";
import { usePostDetail } from "@/hooks/usePostDetail";
import LoadingState from "@/components/ui/LoadingState";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    post,
    creator,
    comments,
    loading,
    commentText,
    setCommentText,
    submitting,
    isOwner,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editBody,
    setEditBody,
    deleting,
    handleSubmitComment,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleBack,
  } = usePostDetail(id);

  if (loading || !post || deleting) {
    return <LoadingState label={deleting ? "Deleting post…" : "Loading post…"} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft color="#fff" size={22} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Post
        </Text>
        {isOwner && !isEditing ? (
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => setIsEditing(true)}
              hitSlop={6}
            >
              <Pencil color="#fff" size={16} />
            </Pressable>
            <Pressable
              style={[styles.headerIconBtn, styles.headerDeleteBtn]}
              onPress={handleDelete}
              hitSlop={6}
            >
              <Trash2 color="#ff4444" size={16} />
            </Pressable>
          </View>
        ) : (
          <View style={{ width: 40, height: 40 }} />
        )}
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
          {isEditing ? (
            <View style={styles.postCard}>
              <Text style={styles.editLabel}>Title</Text>
              <TextInput
                style={styles.editTitleInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Post title"
                placeholderTextColor="#555"
              />
              <Text style={styles.editLabel}>Description</Text>
              <TextInput
                style={styles.editBodyInput}
                value={editBody}
                onChangeText={setEditBody}
                placeholder="Post description"
                placeholderTextColor="#555"
                multiline
                numberOfLines={6}
              />
              <View style={styles.editActionsRow}>
                <Pressable
                  style={[styles.saveBtn, submitting && styles.btnDisabled]}
                  onPress={handleSaveEdit}
                  disabled={submitting}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={handleCancelEdit}
                  disabled={submitting}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
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
          )}

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
                  <Text
                    style={[
                      styles.postBtnText,
                      (!commentText.trim() || submitting) &&
                        styles.postBtnTextDisabled,
                    ]}
                  >
                    Post
                  </Text>
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  headerDeleteBtn: {
    borderColor: "#3a1a1a",
    backgroundColor: "#1a0a0a",
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
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    minHeight: 46,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    textAlignVertical: "center",
  },
  postBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnDisabled: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  postBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  postBtnTextDisabled: {
    color: "#444",
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
  editLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  editTitleInput: {
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editBodyInput: {
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    color: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 100,
  },
  editActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});