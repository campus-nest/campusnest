import { useCallback, useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { authService, savedPostService, savedListingService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Listing } from "@/src/types/listing";
import { useSavedPosts } from "@/src/context/SavedPostsContext";
import { useSavedListings } from "@/src/context/SavedListingsContext";

export type Tab = "listings" | "posts";

export function useSaved() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { savedPostIds, toggleSave, loading: postsContextLoading } = useSavedPosts();
  const { savedListingIds, toggleSaveListing, loading: listingsContextLoading } = useSavedListings();

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;

      setFetchingPosts(true);
      savedPostService.getSavedPosts().then((posts) => {
        setSavedPosts(posts);
        setFetchingPosts(false);
      });

      setFetchingListings(true);
      savedListingService.getSavedListings().then((listings) => {
        setSavedListings(listings);
        setFetchingListings(false);
      });
    }, [currentUserId])
  );

  // Prune lists when context changes
  useEffect(() => {
    setSavedPosts((prev) => prev.filter((p) => savedPostIds.has(p.id)));
  }, [savedPostIds]);

  useEffect(() => {
    setSavedListings((prev) => prev.filter((l) => savedListingIds.has(l.id)));
  }, [savedListingIds]);

  const loading =
    activeTab === "listings"
      ? fetchingListings || listingsContextLoading
      : fetchingPosts || postsContextLoading;

  const handleNavigateToListing = (id: string) => {
    router.push(`/listing/${id}`);
  };

  const handleNavigateToPost = (id: string) => {
    router.push(`/post/${id}`);
  };

  return {
    activeTab,
    setActiveTab,
    savedPosts,
    savedListings,
    loading,
    toggleSave,
    toggleSaveListing,
    handleNavigateToListing,
    handleNavigateToPost,
  };
}
