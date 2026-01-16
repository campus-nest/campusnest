import { getSupabase } from "@/src/lib/supabaseClient";
import { CommentWithProfile, CreateCommentInput } from "@/src/types/comment";

export class CommentService {
  private supabase = getSupabase();

  /**
   * Get all comments for a post with profile information
   */
  async getCommentsByPostId(postId: string): Promise<CommentWithProfile[]> {
    try {
      // First get all comments for the post
      const { data: commentsData, error: commentsError } = await this.supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        return [];
      }

      if (!commentsData || commentsData.length === 0) {
        return [];
      }

      // Get all unique user IDs from comments
      const userIds = [...new Set(commentsData.map((c) => c.user_id))];

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await this.supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      // Create a map of user_id to profile
      const profilesMap = new Map((profilesData || []).map((p) => [p.id, p]));

      // Combine comments with profiles
      return commentsData.map((comment) => ({
        id: comment.id,
        post_id: comment.post_id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at,
        profile: profilesMap.get(comment.user_id) || null,
      }));
    } catch (error) {
      console.error("Unexpected error fetching comments:", error);
      return [];
    }
  }

  /**
   * Create a new comment
   */
  async createComment(
    input: CreateCommentInput,
  ): Promise<{ success: boolean; commentId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("comments")
        .insert({
          post_id: input.post_id,
          user_id: input.user_id,
          content: input.content,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating comment:", error);
        return { success: false, error: error.message };
      }

      return { success: true, commentId: data.id };
    } catch (error) {
      console.error("Unexpected error creating comment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(
    commentId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error deleting comment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const commentService = new CommentService();
