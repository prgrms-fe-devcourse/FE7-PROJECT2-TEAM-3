import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { ChartNoAxesCombined, Trophy, Zap } from "lucide-react";
import type { HashTags, PopularPosts } from "../../types/posts";
import TrendingHashTag from "./TrendingHashTag";
import PopularPost from "./PopularPost";
import { useAuthStore } from "../../stores/authStore";
import type { Profile } from "../../types/profile";
import UserRank from "./UserRank";

export default function SidebarContents() {
  const [populars, setPopulars] = useState<PopularPosts[]>([]);
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [hashs, sethashs] = useState<HashTags[]>([]);
  const [userRank, setUserRank] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const profile = useAuthStore((state) => state.profile);

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

        if (!profile) return;

        // 내가 누른 좋아요들
        const { data: myLikes, error: likeErr } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", profile?._id);
        if (likeErr) throw likeErr;

        setLikedSet(new Set((myLikes ?? []).map((r) => r.post_id)));

        // 유저 랭킹
        const { data: profiles, error: profilesErr } = await supabase
          .from("profiles")
          .select("*");

        if (profilesErr) throw profilesErr;

        const userRanks = profiles.sort((a, b) => b.exp - a.exp).slice(0, 3);

        setUserRank(userRanks);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [profile]);

  return (
    <>
      <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <Trophy className="w-7.25 h-6.5 stroke-[#F2913D]" />
          유저 랭킹
        </h3>
        <div className="flex flex-col gap-2">
          {userRank.map((user, idx) => (
            <UserRank key={user._id} user={user} index={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <ChartNoAxesCombined className="w-7.25 h-6.5 stroke-[#7B61FF]" />
          트랜딩
        </h3>
        <div className="flex flex-col gap-2">
          {hashs.length === 0 && <p>해시태그가 없습니다.</p>}
          {hashs.length > 0 &&
            hashs.map((hash) => (
              <TrendingHashTag key={hash.hashtag} hash={hash} />
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <Zap className="w-7.25 h-6.5 stroke-[#A62F03]" />
          인기 게시물
        </h3>
        <div className="flex flex-col gap-2">
          {populars.length === 0 && <p>인기 게시물이 없습니다.</p>}
          {populars.length > 0 &&
            populars.map((post) => (
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
