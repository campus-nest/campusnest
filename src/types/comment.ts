export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CommentWithProfile extends Comment {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface CreateCommentInput {
  post_id: string;
  user_id: string;
  content: string;
}
