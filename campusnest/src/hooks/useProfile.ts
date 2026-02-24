import { profileService } from "@/src/services";
import { Profile } from "@/src/types/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

interface UseProfileResult {
    profile: Profile | null;
    loading: boolean;
    refresh: () => void;
}

/**
 * Fetches the current user's profile.
 * Re-fetches whenever the screen gains focus (for post-edit refresh).
 */
export function useProfile(): UseProfileResult {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const profileData = await profileService.getCurrentUserProfile();
            if (profileData) {
                setProfile(profileData);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile]),
    );

    return { profile, loading, refresh: fetchProfile };
}
