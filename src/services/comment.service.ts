import { apiClient } from "@/src/lib/apiClient";
import { CommentWithProfile, CreateCommentInput } from "@/src/types/comment";

export class CommentService {
  async getCommentsByPostId(postId: string): Promise<CommentWithProfile[]> {
    try {
      const response = await apiClient.get(`/api/comments/post/${postId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  async createComment(input: CreateCommentInput): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/comments', input);
      return { success: true };
    } catch (error: any) {
      console.error("Error creating comment:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/api/comments/${commentId}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const commentService = new CommentService();
