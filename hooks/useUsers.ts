import { useCallback, useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { authService, postService } from "@/src/services";
import { Post } from "@/src/types/post";
import { useSavedPosts } from "@/src/context/SavedPostsContext";

export type PostFilter = "yourPost" | "recent";

export function useUsers() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("recent");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "landlord" | null>(null);
  const { savedPostIds, toggleSave } = useSavedPosts();

  useEffect(() => {
    const fetchCurrentUserAndRole = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUserId(user?.id || null);
      const userRole = await authService.getUserRole();
      setRole(userRole);
    };
    fetchCurrentUserAndRole();
  }, []);

  // Reload posts list when the tab is focused or filter changes
  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        const allPosts = await postService.getPosts();
        let filteredPosts = allPosts;
        if (activeFilter === "yourPost" && currentUserId && role !== "landlord") {
          filteredPosts = allPosts.filter(
            (post) => post.user_id === currentUserId
          );
        }
        setPosts(filteredPosts);
        setLoading(false);
      };
      fetchPosts();
    }, [activeFilter, currentUserId, role])
  );

  const handleToggleSave = useCallback(
    (postId: string) => {
      toggleSave(postId);
    },
    [toggleSave]
  );

  const filters: { key: PostFilter; label: string }[] =
    role === "landlord"
      ? [{ key: "recent", label: "Recent" }]
      : [
          { key: "recent", label: "Recent" },
          { key: "yourPost", label: "Your Posts" },
        ];

  const handleNavigateToPost = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleNavigateToSaved = () => {
    router.push("/(tabs)/saved");
  };

  return {
    posts,
    loading,
    activeFilter,
    setActiveFilter,
    role,
    savedPostIds,
    handleToggleSave,
    filters,
    handleNavigateToPost,
    handleNavigateToSaved,
  };
}
