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
   * Get all saved posts for a user with full post details.
   *
   * FIX: Previously `{ ...item.posts, saved_at: item.created_at }` spread
   * item.posts correctly but the outer `item.id` (saved_posts row id) was
   * never used — however the spread already gives us item.posts.id as `id`.
   * The real problem was that Supabase returns `item.posts` as null when the
   * join silently fails (e.g. RLS blocking the posts table read), making every
   * entry in the array `{ id: undefined, ... }`. We now filter those out and
   * explicitly pull `posts.id` so the post id is always correct.
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
          ?.filter((item: any) => item.posts !== null) // guard against RLS / deleted posts
          .map((item: any) => ({
            // Use posts.id (the real post id) — NOT item.id (the saved_posts row id)
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

// Export singleton instance
export const savedPostService = new SavedPostService();