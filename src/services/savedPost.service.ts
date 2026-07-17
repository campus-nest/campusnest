import { apiClient } from "@/src/lib/apiClient";
import { Post } from "@/src/types/post";

export class SavedPostService {
  async getSavedPosts(): Promise<Post[]> {
    try {
      const response = await apiClient.get('/api/saved/posts');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      return [];
    }
  }

  async savePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/saved/posts', { postId });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async unsavePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/api/saved/posts/${postId}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async isPostSaved(postId: string): Promise<boolean> {
    try {
      const posts = await this.getSavedPosts();
      return posts.some(p => p.id === postId);
    } catch {
      return false;
    }
  }
}

export const savedPostService = new SavedPostService();