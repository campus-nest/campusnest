import { apiClient } from "@/src/lib/apiClient";
import { Listing } from "@/src/types/listing";

export class SavedListingService {
  async getSavedListings(): Promise<Listing[]> {
    try {
      const response = await apiClient.get('/api/saved/listings');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching saved listings:", error);
      return [];
    }
  }

  async saveListing(listingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/saved/listings', { listingId });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async unsaveListing(listingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/api/saved/listings/${listingId}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async isListingSaved(listingId: string): Promise<boolean> {
    try {
      // Just check if it's in the list for now
      const listings = await this.getSavedListings();
      return listings.some(l => l.id === listingId);
    } catch {
      return false;
    }
  }
}

export const savedListingService = new SavedListingService();