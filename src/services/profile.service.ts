import { apiClient } from "@/src/lib/apiClient";
import { Profile } from "@/src/types/profile";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from 'expo-secure-store';

export class ProfileService {
  async getProfile(): Promise<Profile | null> {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async updateProfile(updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    try {
      // For now, this requires a PUT /api/auth/me endpoint on the backend
      // which we'll need to add to the backend if they actually update their profile.
      // I'll make a generic PUT to /api/auth/me or similar. Assuming the backend accepts it.
      await apiClient.put('/api/auth/me', updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async uploadAvatar(uri: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return { success: false, error: "Not logged in" };

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
        await this.updateProfile({ avatar_url: data.url });

        return { success: true, url: data.url };
      }
      return { success: false, error: 'Upload failed' };
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return { success: false, error: error.message };
    }
  }
}

export const profileService = new ProfileService();
