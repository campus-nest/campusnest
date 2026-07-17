import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  authService,
  commentService,
  postService,
  profileService,
} from "@/src/services";
import { Post } from "@/src/types/post";
import { Profile } from "@/src/types/profile";
import { CommentWithProfile } from "@/src/types/comment";

export function usePostDetail(id: string | undefined) {
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit/delete state
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchComments = async (postId: string) => {
    const fetched = await commentService.getCommentsByPostId(postId);
    setComments(fetched);
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const postData = await postService.getPostById(id);
        if (!postData) {
          setLoading(false);
          return;
        }
        setPost(postData);
        setEditTitle(postData.title ?? "");
        setEditBody(postData.body ?? "");

        const user = await authService.getCurrentUser();
        if (user?.id === postData.user_id) {
          setIsOwner(true);
        }

        const creatorProfile = await profileService.getProfileById(postData.user_id);
        setCreator(creatorProfile);
        await fetchComments(id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;
    const user = await authService.getCurrentUser();
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to comment.");
      return;
    }

    setSubmitting(true);
    const result = await commentService.createComment({
      post_id: id,
      user_id: user.id,
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

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editBody.trim() || !id) {
      Alert.alert("Error", "Title and description cannot be empty.");
      return;
    }

    setSubmitting(true);
    const result = await postService.updatePost(id, {
      title: editTitle.trim(),
      body: editBody.trim(),
    });

    if (result.success) {
      setPost((prev) =>
        prev
          ? { ...prev, title: editTitle.trim(), body: editBody.trim() }
          : prev
      );
      setIsEditing(false);
    } else {
      Alert.alert("Error", result.error || "Failed to update post.");
    }
    setSubmitting(false);
  };

  const handleCancelEdit = () => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const result = await postService.deletePost(id);
              if (result.success) {
                router.replace("/(tabs)");
              } else {
                Alert.alert("Error", result.error ?? "Failed to delete post.");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Something went wrong while deleting.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return {
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
  };
}
