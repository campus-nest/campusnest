import { authService, savedPostService } from "@/src/services";
import { useEffect, useState } from "react";

interface UseSavedPostsResult {
    savedPostIds: Set<string>;
    currentUserId: string | null;
    toggleSave: (postId: string) => Promise<void>;
}

/**
 * Fetches the current user's saved post IDs and provides a toggle function.
 */
export function useSavedPosts(): UseSavedPostsResult {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

    // Resolve currentUserId from session
    useEffect(() => {
        const loadSession = async () => {
            const session = await authService.getSession();
            if (session?.user?.id) {
                setCurrentUserId(session.user.id);
            }
        };
        loadSession();
    }, []);

    // Fetch saved posts when userId becomes available
    useEffect(() => {
        if (!currentUserId) return;

        const fetchSaved = async () => {
            const savedPosts = await savedPostService.getSavedPosts(currentUserId);
            setSavedPostIds(new Set(savedPosts.map((p) => p.id)));
        };

        fetchSaved();
    }, [currentUserId]);

    const toggleSave = async (postId: string) => {
        if (!currentUserId) return;

        const isSaved = savedPostIds.has(postId);

        if (isSaved) {
            const result = await savedPostService.unsavePost(postId, currentUserId);
            if (result.success) {
                setSavedPostIds((prev) => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                });
            }
        } else {
            const result = await savedPostService.savePost(postId, currentUserId);
            if (result.success) {
                setSavedPostIds((prev) => new Set(prev).add(postId));
            }
        }
    };

    return { savedPostIds, currentUserId, toggleSave };
}
