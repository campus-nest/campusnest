import { apiClient } from "@/src/lib/apiClient";
import { Profile } from "@/src/types/profile";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from 'expo-secure-store';

export class ProfileService {
  /**
   * Get the currently authenticated user's profile.
   */
  async getProfile(): Promise<Profile | null> {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data.data.user;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  /**
   * Alias for getProfile() — used by useProfile hook.
   */
  async getCurrentUserProfile(): Promise<Profile | null> {
    return this.getProfile();
  }

  /**
   * Get any user's profile by their ID (for viewing landlord/creator profiles).
   */
  async getProfileById(userId: string): Promise<Profile | null> {
    try {
      const response = await apiClient.get(`/api/auth/users/${userId}`);
      return response.data.data.user;
    } catch (error) {
      console.error("Error fetching profile by ID:", error);
      return null;
    }
  }

  /**
   * Create a profile for a user. On our custom backend, profiles are
   * auto-created during registration, so this is a no-op that just
   * returns the existing profile. Kept for legacy hook compatibility.
   */
  async createProfile(
    userId: string,
    data: Partial<Profile>
  ): Promise<{ success: boolean; error?: string }> {
    // Profiles are auto-created on registration, so just return success.
    return { success: true };
  }

  /**
   * Update a user's profile.
   * Accepts optional userId for legacy hook compatibility,
   * but the backend identifies the user from the JWT token.
   */
  async updateProfile(
    userIdOrUpdates: string | Partial<Profile>,
    maybeUpdates?: Partial<Profile>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Support both calling conventions:
      // updateProfile(updates)           — new style
      // updateProfile(userId, updates)   — legacy hook style
      const updates = typeof userIdOrUpdates === 'string'
        ? maybeUpdates!
        : userIdOrUpdates;

      await apiClient.patch('/api/auth/me', updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload an avatar image.
   * Accepts optional userId for legacy hook compatibility.
   * Returns the uploaded URL string, or null on failure.
   */
  async uploadAvatar(
    uriOrUserId: string,
    maybeUri?: string
  ): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return null;

      // Support both calling conventions:
      // uploadAvatar(uri)           — new style
      // uploadAvatar(userId, uri)   — legacy hook style
      const uri = maybeUri ?? uriOrUserId;

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

      const uploadResult = await FileSystem.uploadAsync(
        `${API_URL}/api/storage/upload`,
        uri,
        {
          httpMethod: "POST",
          headers: { Authorization: `Bearer ${token}` },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'photo',
        }
      );

      if (uploadResult.status === 201) {
        const data = JSON.parse(uploadResult.body);

        // Auto update profile with new avatar URL
        await this.updateProfile({ avatar_url: data.data.url });

        return data.data.url;
      }
      return null;
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  }
}

export const profileService = new ProfileService();
