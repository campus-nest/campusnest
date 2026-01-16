import { getSupabase } from "@/src/lib/supabaseClient";

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export class SavedPostService {
  private supabase = getSupabase();

  /**
   * Save/like a post
   */
  async savePost(
    postId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from("saved_posts").insert({
        user_id: userId,
        post_id: postId,
      });

      if (error) {
        console.error("Error saving post:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error saving post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Unsave/unlike a post
   */
  async unsavePost(
    postId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (error) {
        console.error("Error unsaving post:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error unsaving post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Check if a post is saved by user
   */
  async isPostSaved(postId: string, userId: string): Promise<boolean> {
    try {
      const { data } = await this.supabase
        .from("saved_posts")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Get all saved posts for a user with full post details
   */
  async getSavedPosts(userId: string): Promise<any[]> {
    try {
      const { data, error: _error } = await this.supabase
        .from("saved_posts")
        .select(
          `
          id,
          created_at,
          posts (
            id,
            user_id,
            title,
            body,
            created_at
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (_error) {
        console.error("Error fetching saved posts:", _error);
        return [];
      }

      // Transform the data to return posts with saved info
      return (
        data?.map((item: any) => ({
          ...item.posts,
          saved_at: item.created_at,
        })) || []
      );
    } catch (error) {
      console.error("Unexpected error fetching saved posts:", error);
      return [];
    }
  }
}

// Export singleton instance
export const savedPostService = new SavedPostService();
