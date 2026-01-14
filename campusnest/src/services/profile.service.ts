import { getSupabase } from "@/src/lib/supabaseClient";
import { Profile } from "@/src/types/profile";

export interface UpdateProfileInput {
  full_name?: string;
  role?: "student" | "landlord";
  university?: string;
  year?: string;
  current_address?: string;
  city?: string;
  province?: string;
  email?: string;
  avatar_url?: string;
}

export class ProfileService {
  private supabase = getSupabase();

  /**
   * Get profile by user ID
   */
  async getProfileById(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile;
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUserProfile(): Promise<Profile | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return null;
    }

    return this.getProfileById(user.id);
  }

  /**
   * Update profile by user ID
   */
  async updateProfile(
    userId: string,
    updates: UpdateProfileInput,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Upload avatar to storage and return public URL
   */
  async uploadAvatar(userId: string, uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const fileExt = uri.split(".").pop() ?? "jpg";
      const filePath = `${userId}/${userId}.${fileExt}`;

      const { error } = await this.supabase.storage
        .from("profile_photos")
        .upload(filePath, new Uint8Array(arrayBuffer), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data } = this.supabase.storage
        .from("profile_photos")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Upload avatar error:", error);
      return null;
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
