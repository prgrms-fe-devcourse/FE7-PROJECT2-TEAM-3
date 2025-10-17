import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Posts from "../../components/Posts";
import supabase from "../../utils/supabase";
import type { PostListItem } from "../../types/postList";

export default function PostSearch() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "";
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      let queryBuilder = supabase
        .from("posts")
        .select(
          `
            _id,
            title,
            content,
            channel_id,
            created_at,
            user:profiles (display_name,profile_image,level, badge),
            likes (_id),
            comments (_id),
            hashtags (hashtag)`
        )
        .order("created_at", { ascending: false });

      if (title) {
        queryBuilder = queryBuilder.ilike("title", `%${title}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } else if (data) {
        const formatted: PostListItem[] = (data || []).map((post: any) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          channel_id: post.channel_id,
          created_at: post.created_at,
          user: post.user,
          likeCount: Array.isArray(post.likes) ? post.likes.length : 0,
          commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
          hashtags: (post.hashtags || []).map(
            (h: { hashtag: string }) => h.hashtag
          ),
        }));
        setPosts(formatted);
      }
    }

    fetchPosts();
  }, [title]);

  return <Posts posts={posts} channel={undefined} />;
}
