import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Posts from "../../components/Posts";
import supabase from "../../utils/supabase";
import type { PostListItem, PostSearchItem } from "../../types/post";

export default function PostSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("content") || "";
  const hashtag = searchParams.get("hashtag") || "";
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
            likes:likes(count),
            comments:comments(count),
            hashtags (hashtag)`
        )
        .order("created_at", { ascending: false });

      if (query) {
        queryBuilder = queryBuilder.ilike("content", `%${query}%`);
      }
      if (hashtag) {
        const { data: hashtagRows } = await supabase
          .from("hashtags")
          .select("post_id")
          .ilike("hashtag", `%${hashtag}%`);

        const postIds: string[] = hashtagRows?.map((h) => h.post_id) ?? [];
        queryBuilder = queryBuilder.in("_id", postIds);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } else if (data) {
        const formatted: PostListItem[] = (data || []).map(
          (post: PostSearchItem) => {
            const user = Array.isArray(post.user) ? post.user[0] : post.user;
            return {
              _id: post._id,
              title: post.title,
              content: post.content,
              channel_id: post.channel_id,
              created_at: post.created_at,
              user,
              likeCount:
                Array.isArray(post.likes) && post.likes[0]?.count != null
                  ? post.likes[0].count
                  : 0,
              commentCount:
                Array.isArray(post.comments) && post.comments[0]?.count != null
                  ? post.comments[0].count
                  : 0,
              hashtags: (post.hashtags ?? []).map(
                (h: { hashtag: string }) => h.hashtag
              ),
            };
          }
        );
        setPosts(formatted);
      }
    }

    fetchPosts();
  }, [query, hashtag]);

  return <Posts posts={posts} channel={undefined} />;
}
