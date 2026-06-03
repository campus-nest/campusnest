import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { authService, profileService, savedListingService, savedPostService } from "@/src/services";
import { Profile } from "@/src/types/profile";
import { Post } from "@/src/types/post";
import { Listing } from "@/src/types/listing";

export function useProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      setLoading(true);
      const profileData = await profileService.getCurrentUserProfile();
      if (profileData) {
        setProfile(profileData);
        const session = await authService.getSession();
        if (session?.user?.id) {
          const [posts, listings] = await Promise.all([
            savedPostService.getSavedPosts(session.user.id),
            savedListingService.getSavedListings(session.user.id),
          ]);
          setSavedPosts(posts);
          setSavedListings(listings);
        }
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggingOut]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      const result = await authService.signOut();
      if (result.success) {
        router.replace("/landing");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }, [router]);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return {
    profile,
    savedPosts,
    savedListings,
    loading,
    isLoggingOut,
    handleSignOut,
    initials,
  };
}
