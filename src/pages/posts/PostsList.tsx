import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import Posts from "../../components/Posts";
import type { PostListItem } from "../../types/postListItem";

// TODO: 나중에 타입 가져와서 사용하고, 컴포넌트로 빼서 리팩터링하기

export default function PostsList() {
  const { channel } = useParams();
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase
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

        if (channel) {
          query = query.eq("channel_id", channel);
        }
        const { data, error } = await query;

        if (error) throw error;

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
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      }
    };

    fetchPosts();
  }, [channel]);

  return <Posts posts={posts} channel={channel} />;
}
