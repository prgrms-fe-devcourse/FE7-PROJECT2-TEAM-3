import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Posts from "../../components/Posts";
import supabase from "../../utils/supabase";
import type { PostListItem, PostSearchItem } from "../../types/post";
import PostSkeleton from "../../components/ui/loading/PostSkeleton";
import { TriangleAlert } from "lucide-react";

export default function PostSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("content") || "";
  const hashtag = searchParams.get("hashtag") || "";
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);

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
        setIsLoading(false);
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
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [query, hashtag]);

  if (isLoading) return <PostSkeleton line={2} />;

  return (
    <>
      <div className="flex flex-col gap-10 min-h-full">
        <div className="flex justify-between items-center gap-5 h-15 px-7 border border-[#303A4B] bg-[#161C27] rounded-lg text-sm font-medium text-gray-300">
          {query && (
            <>
              <p>
                검색어 <strong className="text-white">"{query}"</strong>에 대한
                결과입니다.
              </p>
              <p>{posts.length}개의 포스트</p>
            </>
          )}
          {hashtag && (
            <>
              <p>
                <strong className="text-white">#{hashtag}</strong>를 포함한
                포스트 검색 결과입니다.
              </p>
              <p>{posts.length}개의 포스트</p>
            </>
          )}
        </div>
        {posts.length === 0 && (
          <div className="flex-1 flex-center flex-col gap-5 bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
            <TriangleAlert className="w-20 h-20 stroke-1.5" />
            <p>검색된 포스트가 없습니다.</p>
          </div>
        )}
        {posts.length > 0 && <Posts posts={posts} channel={undefined} />}
      </div>
    </>
  );
}
