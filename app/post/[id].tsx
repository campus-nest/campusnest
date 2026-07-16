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
import { Pencil, Trash2 } from "lucide-react-native";
import { usePostDetail } from "@/hooks/usePostDetail";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader, { HeaderActions, HeaderIconBtn } from "@/components/ui/PageHeader";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

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

  const headerRight = isOwner && !isEditing ? (
    <HeaderActions>
      <HeaderIconBtn onPress={() => setIsEditing(true)} hitSlop={6}>
        <Pencil color={colors.text.primary} size={16} />
      </HeaderIconBtn>
      <HeaderIconBtn onPress={handleDelete} danger hitSlop={6}>
        <Trash2 color={colors.danger.default} size={16} />
      </HeaderIconBtn>
    </HeaderActions>
  ) : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageHeader title="Post" onBack={handleBack} right={headerRight} />

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
                placeholderTextColor={colors.text.dim}
              />
              <Text style={styles.editLabel}>Description</Text>
              <TextInput
                style={styles.editBodyInput}
                value={editBody}
                onChangeText={setEditBody}
                placeholder="Post description"
                placeholderTextColor={colors.text.dim}
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
                <Text style={styles.postAuthor}>{creator?.full_name || "Unknown"}</Text>
                <Text style={styles.postDate}>{new Date(post.created_at).toLocaleDateString()}</Text>
              </View>
            </View>
          )}

          {/* Comments section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>
              Comments{comments.length > 0 ? ` (${comments.length})` : ""}
            </Text>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment…"
                placeholderTextColor={colors.text.dim}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                editable={!submitting}
              />
              <Pressable
                style={[styles.postBtn, (!commentText.trim() || submitting) && styles.postBtnDisabled]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.black} size="small" />
                ) : (
                  <Text style={[styles.postBtnText, (!commentText.trim() || submitting) && styles.postBtnTextDisabled]}>
                    Post
                  </Text>
                )}
              </Pressable>
            </View>

            {comments.length === 0 ? (
              <Text style={styles.noComments}>No comments yet — be the first!</Text>
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
    backgroundColor: colors.background.screen,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  postCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.md,
  },
  postTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    lineHeight: 26,
  },
  postBody: {
    color: colors.text.body,
    fontSize: typography.size.md,
    lineHeight: 22,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postAuthor: {
    color: colors.text.primary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  postDate: {
    color: colors.text.dim,
    fontSize: typography.size.sm,
  },
  commentsSection: {
    gap: spacing.lg,
  },
  commentsSectionTitle: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  commentInputRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    fontSize: typography.size.md,
    minHeight: 46,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border.default,
    textAlignVertical: "center",
  },
  postBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnDisabled: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  postBtnText: {
    color: colors.black,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  postBtnTextDisabled: {
    color: "#444",
  },
  noComments: {
    color: colors.text.dim,
    fontSize: typography.size.md,
    textAlign: "center",
    paddingVertical: spacing.xxl,
  },
  commentsList: {
    gap: spacing.md,
  },
  commentItem: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  commentAvatarText: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  commentContent: {
    flex: 1,
    gap: spacing.xs,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthor: {
    color: colors.text.primary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  commentDate: {
    color: colors.text.dim,
    fontSize: typography.size.xs,
  },
  commentText: {
    color: colors.text.body,
    fontSize: typography.size.base,
    lineHeight: 19,
  },
  editLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  editTitleInput: {
    backgroundColor: colors.border.dim,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border.strong,
    padding: 10,
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  editBodyInput: {
    backgroundColor: colors.border.dim,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border.strong,
    padding: 10,
    color: colors.text.primary,
    fontSize: typography.size.md,
    textAlignVertical: "top",
    minHeight: 100,
  },
  editActionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: colors.black,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.border.dim,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  cancelBtnText: {
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
