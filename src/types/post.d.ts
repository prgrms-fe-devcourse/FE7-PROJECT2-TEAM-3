import type { Database } from "./database";
import type { Profile } from "./profile";

type Post = Database["public"]["Tables"]["posts"]["Row"];

// 사이드바 - 인기 게시물용
interface PopularPosts extends Post {
  likes_count: number;
  comments_count: number;
  total_engagement: number;
  profiles: {
    display_name: string;
    profile_image: string | null;
  };
}

// 사이드바 - 해시태그 계산용
interface HashTags {
  hashtag: string;
  count: number;
}

interface UserProfile extends Profile {
  display_name: string;
  profile_image: string | null;
  level: number | null;
  badge: string | null;
  exp: number | null;
}

interface PostSearchItem {
  _id: string;
  title: string;
  content: string;
  channel_id: string | null;
  created_at: string;
  user: Profile | Profile[];
  likes: { count: number }[];
  comments: { count: number }[];
  hashtags: { hashtag: string }[];
}

interface PostListItem {
  _id: string;
  title: string;
  content: string;
  channel_id: string | null;
  created_at: string;
  user: Profile;
  likeCount: number;
  commentCount: number;
  hashtags: string[];
}
