import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { savedListingService, profileService } from "@/src/services";
  
  interface SavedListingsContextValue {
    savedListingIds: Set<string>;
    loading: boolean;
    toggleSaveListing: (listingId: string) => Promise<boolean>;
    refresh: () => Promise<void>;
  }
  
  const SavedListingsContext = createContext<SavedListingsContextValue>({
    savedListingIds: new Set(),
    loading: true,
    toggleSaveListing: async () => false,
    refresh: async () => {},
  });
  
  export function SavedListingsProvider({ children }: { children: React.ReactNode }) {
    const [savedListingIds, setSavedListingIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const userIdRef = useRef<string | null>(null);
  
    // Resolve current user
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
            setSavedListingIds(new Set());
            setLoading(false);
          }
        } catch (err) {
          if (mounted) {
            userIdRef.current = null;
            setUserId(null);
            setSavedListingIds(new Set());
            setLoading(false);
          }
        }
      }
  
      checkUser();
  
      return () => {
        mounted = false;
      };
    }, []);
  
    // Fetch saved listings
    const fetchSaved = useCallback(async (uid: string) => {
      setLoading(true);
      try {
        const listings = await savedListingService.getSavedListings();
        setSavedListingIds(new Set(listings.map((l: any) => l.id)));
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      if (!userId) return;
      fetchSaved(userId);
    }, [userId, fetchSaved]);
  
    const toggleSaveListing = useCallback(
      async (listingId: string): Promise<boolean> => {
        const uid = userIdRef.current;
        if (!uid) return false;
  
        const isSaved = savedListingIds.has(listingId);
  
        // Optimistic update
        setSavedListingIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.delete(listingId);
          else next.add(listingId);
          return next;
        });
  
        const result = isSaved
          ? await savedListingService.unsaveListing(listingId, uid)
          : await savedListingService.saveListing(listingId, uid);
  
        if (!result.success) {
          // Roll back
          setSavedListingIds((prev) => {
            const next = new Set(prev);
            if (isSaved) next.add(listingId);
            else next.delete(listingId);
            return next;
          });
        }
  
        return result.success;
      },
      [savedListingIds]
    );
  
    const refresh = useCallback(async () => {
      const uid = userIdRef.current;
      if (uid) await fetchSaved(uid);
    }, [fetchSaved]);
  
    return (
      <SavedListingsContext.Provider value={{ savedListingIds, loading, toggleSaveListing, refresh }}>
        {children}
      </SavedListingsContext.Provider>
    );
  }
  
  export function useSavedListings(): SavedListingsContextValue {
    return useContext(SavedListingsContext);
  }
