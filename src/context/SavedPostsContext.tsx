import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { savedPostService, profileService } from "@/src/services";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SavedPostsContextValue {
  /** Set of post IDs that the current user has saved. */
  savedPostIds: Set<string>;
  /** True while the initial load or a refetch is in flight. */
  loading: boolean;
  /** Toggle save / unsave for a post. Returns true on success. */
  toggleSave: (postId: string) => Promise<boolean>;
  /** Manually re-fetch the full list from the server. */
  refresh: () => Promise<void>;
}

const SavedPostsContext = createContext<SavedPostsContextValue>({
  savedPostIds: new Set(),
  loading: true,
  toggleSave: async () => false,
  refresh: async () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SavedPostsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  // Keep a ref so we can read userId inside the realtime callback without
  // re-subscribing every time userId changes.
  const userIdRef = useRef<string | null>(null);

  // Resolve current user once
  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      try {
        const profile = await profileService.getProfile();
        if (!mounted) return;
        const uid = profile?.id ?? null;
        userIdRef.current = uid;
        setUserId(uid);
        if (!uid) {
          setSavedPostIds(new Set());
          setLoading(false);
        }
      } catch {
        if (mounted) {
          userIdRef.current = null;
          setUserId(null);
          setSavedPostIds(new Set());
          setLoading(false);
        }
      }
    }

    checkUser();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch the full saved-post list whenever userId changes
  const fetchSaved = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const posts = await savedPostService.getSavedPosts();
      setSavedPostIds(new Set(posts.map((p: any) => p.id)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchSaved(userId);
  }, [userId, fetchSaved]);

  // Public actions
  // ------------------------------------------------------------------

  const toggleSave = useCallback(
    async (postId: string): Promise<boolean> => {
      const uid = userIdRef.current;
      if (!uid) return false;

      const isSaved = savedPostIds.has(postId);

      // Optimistic update — flip the state immediately
      setSavedPostIds((prev) => {
        const next = new Set(prev);
        if (isSaved) {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });

      // Persist to the server
      const result = isSaved
        ? await savedPostService.unsavePost(postId)
        : await savedPostService.savePost(postId);

      if (!result.success) {
        // Roll back the optimistic update on failure
        setSavedPostIds((prev) => {
          const next = new Set(prev);
          if (isSaved) {
            next.add(postId); // re-add
          } else {
            next.delete(postId); // re-remove
          }
          return next;
        });
      }

      return result.success;
    },
    [savedPostIds]
  );

  const refresh = useCallback(async () => {
    const uid = userIdRef.current;
    if (uid) await fetchSaved(uid);
  }, [fetchSaved]);

  return (
    <SavedPostsContext.Provider
      value={{ savedPostIds, loading, toggleSave, refresh }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSavedPosts(): SavedPostsContextValue {
  return useContext(SavedPostsContext);
}
