import { getSupabase } from "@/src/lib/supabaseClient";
import {
  Listing,
  CreateListingInput,
  ListingFilters,
} from "@/src/types/listing";
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

    if (filters?.searchQuery) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%`,
      );
    }

    if (filters?.minRent !== undefined) {
      query = query.gte("rent", filters.minRent);
    }

    if (filters?.maxRent !== undefined) {
      query = query.lte("rent", filters.maxRent);
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
    input: CreateListingInput,
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
   * Update an existing listing
   */
  async updateListing(
    listingId: string,
    input: Partial<CreateListingInput>,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("listings")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", listingId);

    if (error) {
      console.error("Error updating listing:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Delete a listing and all associated photos from Supabase Storage.
   * Cascade delete handles saved_listings rows automatically (via DB constraint).
   */
  async deleteListing(
    listingId: string,
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Fetch existing photo paths so we can clean up storage
    const { data: listing, error: fetchError } = await this.supabase
      .from("listings")
      .select("photo_urls, landlord_id")
      .eq("id", listingId)
      .single();

    if (fetchError) {
      console.error("Error fetching listing for delete:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // 2. Delete photos from storage (best-effort — don't block if this fails)
    if (listing?.photo_urls?.length) {
      const storagePaths = listing.photo_urls
        .map((url: string) => {
          try {
            // Extract the path after "/listing_photos/"
            const marker = "/listing_photos/";
            const idx = url.indexOf(marker);
            return idx !== -1 ? url.slice(idx + marker.length) : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[];

      if (storagePaths.length) {
        const { error: storageError } = await this.supabase.storage
          .from("listing_photos")
          .remove(storagePaths);

        if (storageError) {
          // Log but don't block — the row delete is more important
          console.warn("Error deleting listing photos from storage:", storageError);
        }
      }
    }

    // 3. Delete the listing row.
    //    saved_listings rows cascade-delete automatically via the FK constraint.
    const { error: deleteError } = await this.supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (deleteError) {
      console.error("Error deleting listing:", deleteError);
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  }

  /**
   * Upload photos for a listing and return public URLs
   */
  async uploadListingPhotos(
    landlordId: string,
    photoUris: string[],
  ): Promise<string[]> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

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
          },
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

  /**
   * Delete specific photos from storage by their public URLs
   */
  async deleteListingPhotos(photoUrls: string[]): Promise<void> {
    const storagePaths = photoUrls
      .map((url) => {
        try {
          const marker = "/listing_photos/";
          const idx = url.indexOf(marker);
          return idx !== -1 ? url.slice(idx + marker.length) : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[];

    if (!storagePaths.length) return;

    const { error } = await this.supabase.storage
      .from("listing_photos")
      .remove(storagePaths);

    if (error) {
      console.warn("Error deleting photos from storage:", error);
    }
  }
}

// Export singleton instance
export const listingService = new ListingService();