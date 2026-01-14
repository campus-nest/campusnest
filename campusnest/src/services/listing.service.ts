import { getSupabase } from "@/src/lib/supabaseClient";
import { Listing, CreateListingInput, ListingFilters } from "@/src/types/listing";
import * as FileSystem from "expo-file-system/legacy";

export class ListingService {
  private supabase = getSupabase();

  /**
   * Get all listings with optional filters
   */
  async getListings(filters?: ListingFilters): Promise<Listing[]> {
    let query = this.supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.visibility) {
      query = query.eq("visibility", filters.visibility);
    }

    if (filters?.landlord_id) {
      query = query.eq("landlord_id", filters.landlord_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      return [];
    }

    return (data as Listing[]) ?? [];
  }

  /**
   * Get listing by ID
   */
  async getListingById(listingId: string): Promise<Listing | null> {
    const { data, error } = await this.supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (error) {
      console.error("Error fetching listing:", error);
      return null;
    }

    return data as Listing;
  }

  /**
   * Create a new listing
   */
  async createListing(
    input: CreateListingInput
  ): Promise<{ success: boolean; listingId?: string; error?: string }> {
    const { data, error } = await this.supabase
      .from("listings")
      .insert(input)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating listing:", error);
      return { success: false, error: error.message };
    }

    return { success: true, listingId: data.id };
  }

  /**
   * Upload photos for a listing and return public URLs
   */
  async uploadListingPhotos(
    landlordId: string,
    photoUris: string[]
  ): Promise<string[]> {
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session for photo upload");
      return [];
    }

    const uploadedUrls: string[] = [];

    for (const uri of photoUris) {
      try {
        const fileExt = uri.split(".").pop() || "jpg";
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `listings/${landlordId}/${fileName}`;

        const uploadResult = await FileSystem.uploadAsync(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/listing_photos/${filePath}`,
          uri,
          {
            httpMethod: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": `image/${fileExt}`,
            },
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          }
        );

        if (uploadResult.status === 200) {
          const { data } = this.supabase.storage
            .from("listing_photos")
            .getPublicUrl(filePath);

          uploadedUrls.push(data.publicUrl);
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }

    return uploadedUrls;
  }
}

// Export singleton instance
export const listingService = new ListingService();