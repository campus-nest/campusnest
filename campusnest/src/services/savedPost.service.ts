import { getSupabase } from "@/src/lib/supabaseClient";
import { Post } from "@/src/types/post";

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export class SavedPostService {
  private supabase = getSupabase();

  /**
   * Save a post.
   * Uses upsert with ignoreDuplicates so a double-tap or any retry is a no-op
   * at the DB level rather than a unique-constraint error.
   */
  async savePost(
    postId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("saved_posts")
        .upsert(
          { user_id: userId, post_id: postId },
          { onConflict: "user_id,post_id", ignoreDuplicates: true },
        );

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
   * Unsave a post.
   * With the unique constraint in place there is always at most one row to
   * delete, so the DELETE event Realtime fires has an unambiguous post_id.
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
   * Check if a post is saved by user.
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
   * Get all saved posts for a user with full post details.
   * Filters out null joins (deleted posts or RLS-blocked reads).
   */
  async getSavedPosts(userId: string): Promise<Post[]> {
    try {
      const { data, error } = await this.supabase
        .from("saved_posts")
        .select(
          `
          id,
          created_at,
          post_id,
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

      if (error) {
        console.error("Error fetching saved posts:", error);
        return [];
      }

      return (
        data
          ?.filter((item: any) => item.posts !== null)
          .map((item: any) => ({
            id: item.posts.id,
            user_id: item.posts.user_id,
            title: item.posts.title,
            body: item.posts.body,
            created_at: item.posts.created_at,
            saved_at: item.created_at,
          })) || []
      );
    } catch (error) {
      console.error("Unexpected error fetching saved posts:", error);
      return [];
    }
  }
}

export const savedPostService = new SavedPostService();