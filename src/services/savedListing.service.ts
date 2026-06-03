import { getSupabase } from "@/src/lib/supabaseClient";
import { Listing } from "@/src/types/listing";

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export class SavedListingService {
  private supabase = getSupabase();

  async saveListing(
    listingId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("saved_listings")
        .upsert(
          { user_id: userId, listing_id: listingId },
          { onConflict: "user_id,listing_id", ignoreDuplicates: true },
        );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async unsaveListing(
    listingId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("saved_listings")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getSavedListings(userId: string): Promise<Listing[]> {
    try {
      const { data, error } = await this.supabase
        .from("saved_listings")
        .select(
          `
          id,
          created_at,
          listing_id,
          listings (
            id,
            landlord_id,
            title,
            address,
            rent,
            lease_term,
            utilities,
            bedrooms,
            bathrooms,
            status,
            visibility,
            move_in_date,
            description,
            nearby_university,
            is_furnished,
            location_area,
            photo_urls,
            latitude,
            longitude,
            created_at,
            updated_at
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching saved listings:", error);
        return [];
      }

      return (
        data
          ?.filter((item: any) => item.listings !== null)
          .map((item: any) => item.listings as Listing) || []
      );
    } catch (error) {
      console.error("Unexpected error fetching saved listings:", error);
      return [];
    }
  }
}

export const savedListingService = new SavedListingService();