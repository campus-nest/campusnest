import { Listing } from "@/src/types/listing";

/** Sort listings newest first */
export const sortByCreatedAtDesc = (a: Listing, b: Listing): number =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

/** Sort listings cheapest first (null rent goes to end) */
export const sortByRentAsc = (a: Listing, b: Listing): number =>
    (a.rent ?? Number.POSITIVE_INFINITY) - (b.rent ?? Number.POSITIVE_INFINITY);

/** Sort listings by earliest move-in date (null goes to end) */
export const sortByMoveInAsc = (a: Listing, b: Listing): number => {
    if (!a.move_in_date) return 1;
    if (!b.move_in_date) return -1;
    return (
        new Date(a.move_in_date).getTime() - new Date(b.move_in_date).getTime()
    );
};
