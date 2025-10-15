import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { ChartNoAxesCombined, Trophy, Zap } from "lucide-react";
import type { HashTags, PopularPosts } from "../../types/posts";
import TrendingHashTag from "./TrendingHashTag";
import PopularPost from "./PopularPost";

export default function SidebarContents() {
  const [populars, setPopulars] = useState<PopularPosts[]>([]);
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [hashs, sethashs] = useState<HashTags[]>([]);
  const [userRank, setUserRank] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data: posts, error } = await supabase
          .from("posts")
          .select(
            `*, likes(count), comments(count), profiles(display_name, profile_image)`
          );
        if (error) throw error;

        const postEngagement = posts?.map((post) => ({
          ...post,
          likes_count: post.likes[0].count || 0,
          comments_count: post.comments[0].count || 0,
          total_engagement:
            (post.likes[0].count || 0) + (post.comments[0].count || 0),
        }));

        const popularPosts = postEngagement
          .sort((a, b) => b.total_engagement - a.total_engagement)
          .slice(0, 3);

        setPopulars(popularPosts);

        // 해시태그 모으기
        const { data: hashtags, error: hashErr } = await supabase
          .from("hashtags")
          .select(`*`);
        if (hashErr) throw hashErr;

        // 해시태그 맵 만들기
        const map = new Map<string, number>();
        for (const tag of hashtags) {
          const key = tag.hashtag;
          if (!key) continue;

          map.set(key, (map.get(key) ?? 0) + 1);
        }
        const hashArr = [...map.entries()]
          .map(([tag, count]) => ({
            hashtag: tag,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        sethashs(hashArr);

        // 내 ID확인
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          // 로그인 안했으면 초기값
          setLikedSet(new Set());
          return;
        }

        // 내가 누른 좋아요들
        const { data: myLikes, error: likeErr } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id);
        if (likeErr) throw likeErr;

        setLikedSet(new Set((myLikes ?? []).map((r) => r.post_id)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <Trophy className="w-7.25 h-6.5 stroke-[#F2913D]" />
          User Ranking
        </h3>
        <div className="flex flex-col gap-2">
          <article className="flex-center gap-2 p-3 border border-transparent rounded-lg cursor-pointer hover:border-[#85523E] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(242,145,61,0.1)_100%)]">
            <div className="overflow-hidden w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 flex flex-col">
              <h4 className="overflow-hidden text-sm text-ellipsis whitespace-nowrap font-semibold text-white">
                닉네임
              </h4>
              <p className="text-xs text-[#E9AF74]">12,420 exp</p>
            </div>
          </article>
          <article className="flex-center gap-2 p-3 border border-transparent rounded-lg cursor-pointer hover:border-[#85523E] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(242,145,61,0.1)_100%)]">
            <div className="overflow-hidden w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 flex flex-col">
              <h4 className="overflow-hidden text-sm text-ellipsis whitespace-nowrap font-semibold text-white">
                닉네임
              </h4>
              <p className="text-xs text-gray-500">12,420 exp</p>
            </div>
          </article>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <ChartNoAxesCombined className="w-7.25 h-6.5 stroke-[#7B61FF]" />
          Trending
        </h3>
        <div className="flex flex-col gap-2">
          {hashs.map((hash) => (
            <TrendingHashTag key={hash.hashtag} hash={hash} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <Zap className="w-7.25 h-6.5 stroke-[#A62F03]" />
          Popular Posts
        </h3>
        <div className="flex flex-col gap-2">
          {populars.map((post) => (
            <PopularPost
              key={post._id}
              post={post}
              liked={likedSet.has(post._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
