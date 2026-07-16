import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.screen }}>
      <PageHeader title="Post" onBack={handleBack} right={headerRight} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxxl, gap: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          {/* Post card */}
          {isEditing ? (
            <Card variant="elevated" style={{ padding: spacing.xl, gap: spacing.md }}>
              <Input label="Title" value={editTitle} onChangeText={setEditTitle} placeholder="Post title" />
              <Input
                label="Description"
                value={editBody}
                onChangeText={setEditBody}
                placeholder="Post description"
                multiline
                numberOfLines={6}
                style={{ textAlignVertical: "top", minHeight: 100 }}
              />
              <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    borderRadius: radius.sm,
                    paddingVertical: spacing.md,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: submitting ? 0.5 : 1,
                  }}
                  onPress={handleSaveEdit}
                  disabled={submitting}
                >
                  <Text style={{ color: colors.black, fontWeight: typography.weight.bold, fontSize: typography.size.md }}>
                    Save
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: colors.border.dim,
                    borderRadius: radius.sm,
                    paddingVertical: spacing.md,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: colors.border.strong,
                  }}
                  onPress={handleCancelEdit}
                  disabled={submitting}
                >
                  <Text style={{ color: colors.text.primary, fontWeight: typography.weight.semibold, fontSize: typography.size.md }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </Card>
          ) : (
            <Card variant="elevated" style={{ padding: spacing.xl, gap: spacing.md }}>
              <Text style={{ color: colors.text.primary, fontSize: typography.size.xxl, fontWeight: typography.weight.bold, lineHeight: 26 }}>
                {post.title}
              </Text>
              <Text
                style={{
                  color: colors.text.body,
                  fontSize: typography.size.md,
                  lineHeight: 22,
                  paddingBottom: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.default,
                }}
              >
                {post.body}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: colors.text.primary, fontSize: typography.size.base, fontWeight: typography.weight.semibold }}>
                  {creator?.full_name || "Unknown"}
                </Text>
                <Text style={{ color: colors.text.dim, fontSize: typography.size.sm }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </Text>
              </View>
            </Card>
          )}

          {/* Comments section */}
          <View style={{ gap: spacing.lg }}>
            <Text style={{ color: colors.text.primary, fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
              Comments{comments.length > 0 ? ` (${comments.length})` : ""}
            </Text>

            <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: colors.background.elevated,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.md + 2,
                  paddingVertical: spacing.md,
                  color: colors.text.primary,
                  fontSize: typography.size.md,
                  minHeight: 46,
                  maxHeight: 120,
                  borderWidth: 1,
                  borderColor: colors.border.default,
                  textAlignVertical: "center",
                }}
                placeholder="Add a comment…"
                placeholderTextColor={colors.text.dim}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                editable={!submitting}
              />
              <Pressable
                style={{
                  backgroundColor: !commentText.trim() || submitting ? colors.background.elevated : colors.white,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.lg + 2,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: !commentText.trim() || submitting ? 1 : 0,
                  borderColor: colors.border.default,
                }}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.black} size="small" />
                ) : (
                  <Text
                    style={{
                      color: !commentText.trim() ? colors.text.disabled : colors.black,
                      fontSize: typography.size.md,
                      fontWeight: typography.weight.bold,
                    }}
                  >
                    Post
                  </Text>
                )}
              </Pressable>
            </View>

            {comments.length === 0 ? (
              <Text style={{ color: colors.text.dim, fontSize: typography.size.md, textAlign: "center", paddingVertical: spacing.xxl }}>
                No comments yet — be the first!
              </Text>
            ) : (
              <View style={{ gap: spacing.md }}>
                {comments.map((comment) => (
                  <Card
                    key={comment.id}
                    variant="elevated"
                    style={{ flexDirection: "row", gap: spacing.md, padding: spacing.md }}
                  >
                    <Avatar
                      size={32}
                      initials={comment.profile?.full_name?.[0]?.toUpperCase() || "?"}
                      style={{ flexShrink: 0 }}
                    />
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: colors.text.primary, fontSize: typography.size.base, fontWeight: typography.weight.semibold }}>
                          {comment.profile?.full_name || "Anonymous"}
                        </Text>
                        <Text style={{ color: colors.text.dim, fontSize: typography.size.xs }}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={{ color: colors.text.body, fontSize: typography.size.base, lineHeight: 19 }}>
                        {comment.content}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
