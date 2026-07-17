import { apiClient } from "@/src/lib/apiClient";
import {
  Listing,
  CreateListingInput,
  ListingFilters,
} from "@/src/types/listing";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from 'expo-secure-store';

export class ListingService {
  /**
   * Get all listings with optional filters
   */
  async getListings(filters?: ListingFilters): Promise<Listing[]> {
    try {
      const response = await apiClient.get('/api/listings', { params: filters });
      return response.data as Listing[];
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  }

  /**
   * Get listing by ID
   */
  async getListingById(listingId: string): Promise<Listing | null> {
    try {
      const response = await apiClient.get(`/api/listings/${listingId}`);
      return response.data as Listing;
    } catch (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
  }

  /**
   * Create a new listing
   */
  async createListing(
    input: CreateListingInput,
  ): Promise<{ success: boolean; listingId?: string; error?: string }> {
    try {
      const response = await apiClient.post('/api/listings', input);
      return { success: true, listingId: response.data.id };
    } catch (error: any) {
      console.error("Error creating listing:", error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Update an existing listing
   */
  async updateListing(
    listingId: string,
    input: Partial<CreateListingInput>,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.put(`/api/listings/${listingId}`, input);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating listing:", error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Delete a listing and all associated photos
   */
  async deleteListing(
    listingId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the listing first to find photos to delete
      const listing = await this.getListingById(listingId);
      
      // Delete the listing (the DB cascade handles saved_listings)
      await apiClient.delete(`/api/listings/${listingId}`);

      // Delete photos from backend storage
      if (listing?.photo_urls?.length) {
        await this.deleteListingPhotos(listing.photo_urls);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Upload photos for a listing and return public URLs
   */
  async uploadListingPhotos(
    landlordId: string, // Kept for signature compatibility, though backend uses token
    photoUris: string[],
  ): Promise<string[]> {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      console.error("No active session for photo upload");
      return [];
    }

    const uploadedUrls: string[] = [];
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    for (const uri of photoUris) {
      try {
        const uploadResult = await FileSystem.uploadAsync(
          `${API_URL}/api/storage/upload`,
          uri,
          {
            httpMethod: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'photo',
          },
        );

        if (uploadResult.status === 201) {
          const data = JSON.parse(uploadResult.body);
          if (data.url) uploadedUrls.push(data.url);
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
    for (const url of photoUrls) {
      try {
        await apiClient.delete('/api/storage/delete', {
          data: { fileUrl: url }
        });
      } catch (error) {
        console.warn("Error deleting photo from storage:", error);
      }
    }
  }
}

// Export singleton instance
export const listingService = new ListingService();