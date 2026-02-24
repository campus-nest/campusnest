import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { Role } from "@/src/types/role";
import { useEffect, useState } from "react";

interface UseListingsResult {
    listings: Listing[];
    loading: boolean;
}

/**
 * Fetches listings whenever role or activeFilter changes.
 * - Students always see public active listings.
 * - Landlords see their own listings ("yourListings") or public active listings ("recent").
 *
 * Does nothing if role is null.
 */
export function useListings(
    role: Role | null,
    activeFilter: string,
): UseListingsResult {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!role) return;

        let cancelled = false;

        const fetchListings = async () => {
            setLoading(true);

            try {
                const session = await authService.getSession();
                if (cancelled) return;

                let fetchedListings: Listing[] = [];

                if (role === "student") {
                    fetchedListings = await listingService.getListings({
                        status: "active",
                        visibility: "public",
                    });
                } else {
                    if (activeFilter === "yourListings") {
                        const landlordId = session?.user?.id;

                        if (!landlordId) {
                            fetchedListings = [];
                        } else {
                            fetchedListings = await listingService.getListings({
                                landlord_id: landlordId,
                            });
                        }
                    } else {
                        fetchedListings = await listingService.getListings({
                            status: "active",
                            visibility: "public",
                        });
                    }
                }

                if (!cancelled) setListings(fetchedListings);
            } catch (e) {
                if (!cancelled) setListings([]);
                console.error("Failed to fetch listings:", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchListings();

        return () => {
            cancelled = true;
        };
    }, [role, activeFilter]);

    return { listings, loading };
}
