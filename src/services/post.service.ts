import { apiClient } from "@/src/lib/apiClient";
import { Post, CreatePostInput } from "@/src/types/post";

export class PostService {
  async getPosts(): Promise<Post[]> {
    try {
      const response = await apiClient.get('/api/posts');
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  async getPostById(postId: string): Promise<Post | null> {
    try {
      const response = await apiClient.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  async createPost(input: CreatePostInput): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await apiClient.post('/api/posts', input);
      return { success: true, postId: response.data.id };
    } catch (error: any) {
      console.error("Error creating post:", error);
      return { success: false, error: error.message };
    }
  }

  async updatePost(postId: string, title: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.put(`/api/posts/${postId}`, { title, body });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/api/posts/${postId}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const postService = new PostService();
