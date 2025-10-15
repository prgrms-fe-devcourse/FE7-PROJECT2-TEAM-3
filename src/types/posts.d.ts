import type { Database } from "./database";

type Post = Database["public"]["Tables"]["posts"]["Row"];

// 인기 게시물용
interface PopularPosts extends Post {
  likes_count: number;
  comments_count: number;
  total_engagement: number;
  profiles: {
    display_name: string;
    profile_image: string | null;
  };
}

// 해시태그 계산용
interface HashTags {
  hashtag: string;
  count: number;
}
