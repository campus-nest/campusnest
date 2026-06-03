import { getSupabase } from "@/src/lib/supabaseClient";
import { Post, CreatePostInput } from "@/src/types/post";

export class PostService {
  private supabase = getSupabase();

  /**
   * Get all posts
   */
  async getPosts(): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }

    return (data as Post[]) ?? [];
  }

  /**
   * Get post by ID
   */
  async getPostById(postId: string): Promise<Post | null> {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      return null;
    }

    return data as Post;
  }

  /**
   * Create a new post
   */
  async createPost(
    input: CreatePostInput,
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    const { data, error } = await this.supabase
      .from("posts")
      .insert(input)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return { success: false, error: error.message };
    }

    return { success: true, postId: data.id };
  }

  /**
   * Update an existing post
   */
  async updatePost(
    postId: string,
    input: Partial<CreatePostInput>,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("posts")
      .update(input)
      .eq("id", postId);

    if (error) {
      console.error("Error updating post:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Delete a post
   */
  async deletePost(
    postId: string,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}

// Export singleton instance
export const postService = new PostService();
