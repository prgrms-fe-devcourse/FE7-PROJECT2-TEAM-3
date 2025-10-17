export type PostListItem = {
  _id: string;
  title: string;
  created_at: string;
  content: string;
  channel_id: string;
  user: {
    display_name: string;
    profile_image: string | null;
    level: number;
    badge?: string;
  };
  likeCount: number;
  commentCount: number;
  hashtags: string[];
};
