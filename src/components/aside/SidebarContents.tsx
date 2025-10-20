import { useCallback, useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import {
  ChartNoAxesCombined,
  Heart,
  MessageSquare,
  Trophy,
  Zap,
} from "lucide-react";
import type { HashTags, PopularPosts } from "../../types/post";
import TrendingHashTag from "./TrendingHashTag";
import PopularPost from "./PopularPost";
import { useAuthStore } from "../../stores/authStore";
import type { UserRankItem } from "../../types/profile";
import UserRank from "./UserRank";
import UserRankingSkeleton from "../ui/loading/UserRankingSkeleton";
import TrendingSkleton from "../ui/loading/TrendingSkleton";

export default function SidebarContents() {
  const [populars, setPopulars] = useState<PopularPosts[]>([]);
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [hashs, sethashs] = useState<HashTags[]>([]);
  const [userRank, setUserRank] = useState<UserRankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const profile = useAuthStore((state) => state.profile);

  // 해시태그 계산 최적화: Map 생성 시 직접 카운팅
  const getTopHashtags = useCallback((hashtags: HashTags[]) => {
    const map = new Map<string, number>();
    for (const { hashtag } of hashtags) {
      if (hashtag) {
        map.set(hashtag, (map.get(hashtag) ?? 0) + 1);
      }
    }
    return [...map.entries()]
      .map(([tag, count]) => ({ hashtag: tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const [postsRes, hashtagsRes, profilesRes] = await Promise.all([
          supabase
            .from("posts")
            .select(
              `*, likes(count), comments(count), profiles(display_name, profile_image)`
            ),
          supabase.from("hashtags").select("*"),
          supabase.from("profiles").select("*"),
        ]);

        if (postsRes.error) throw postsRes.error;
        if (hashtagsRes.error) throw hashtagsRes.error;
        if (profilesRes.error) throw profilesRes.error;

        // 인기 게시물 처리
        const postEngagement =
          postsRes.data?.map((post) => ({
            ...post,
            likes_count: post.likes[0]?.count ?? 0,
            comments_count: post.comments[0]?.count ?? 0,
            total_engagement:
              (post.likes[0]?.count ?? 0) + (post.comments[0]?.count ?? 0),
          })) ?? [];

        const topPosts = postEngagement
          .sort((a, b) => b.total_engagement - a.total_engagement)
          .slice(0, 3);

        setPopulars(topPosts);

        // 상위 해시태그
        const topHashtags = getTopHashtags(hashtagsRes.data ?? []);
        sethashs(topHashtags);

        // 유저 랭킹
        const topUsers = (profilesRes.data ?? [])
          .sort((a, b) => (b.exp ?? 0) - (a.exp ?? 0))
          .slice(0, 3);

        setUserRank(topUsers);

        // 현재 사용자의 좋아요 정보 가져오기
        if (profile?._id) {
          const { data: myLikes, error: likeErr } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", profile._id);

          if (likeErr) throw likeErr;

          setLikedSet(
            new Set((myLikes ?? []).map((r) => r.post_id).filter(Boolean))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [profile?._id, getTopHashtags]);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
          <h3 className="flex items-center gap-3 font-bold text-xl text-white">
            <Trophy className="w-7.25 h-6.5 stroke-[#F2913D]" />
            유저 랭킹
          </h3>
          <div className="flex flex-col gap-2 animate-pulse">
            <UserRankingSkeleton />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
          <h3 className="flex items-center gap-3 font-bold text-xl text-white">
            <ChartNoAxesCombined className="w-7.25 h-6.5 stroke-[#7B61FF]" />
            트랜딩
          </h3>
          <div className="flex flex-col gap-2 animate-pulse">
            <TrendingSkleton />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-4">
          <h3 className="flex items-center gap-3 font-bold text-xl text-white">
            <Zap className="w-7.25 h-6.5 stroke-[#A62F03]" />
            인기 게시물
          </h3>
          <div className="flex flex-col gap-2 animate-pulse">
            <article className="flex gap-3 p-3 bg-[#161C27] rounded-lg cursor-pointer hover:opacity-70">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center flex-wrap gap-x-2.5">
                  <p className="w-15 h-5 rounded-sm bg-gray-200"></p>
                  <p className="w-10 h-5 rounded-sm bg-gray-200"></p>
                </div>
                <div className="w-full h-5 rounded-sm bg-gray-200"></div>
                <div className="flex gap-3">
                  <p className="flex-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
                    <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
                  </p>
                  <p className="flex-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
                    <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 p-4 border-b border-b-[#303A4B]">
        <h3 className="flex items-center gap-3 font-bold text-xl text-white">
          <Trophy className="w-7.25 h-6.5 stroke-[#F2913D]" />
          유저 랭킹
        </h3>
        <div className="flex flex-col gap-2">
          {userRank.length === 0 && (
            <p className="flex-center gap-3 py-5 bg-[#161C27] rounded-lg text-gray-400 font-semibold text-xs">
              등록된 유저가 없습니다.
            </p>
          )}
          {userRank.length > 0 &&
            userRank.map((user, idx) => (
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
          {hashs.length === 0 && (
            <p className="flex-center gap-3 py-5 bg-[#161C27] rounded-lg text-gray-400 font-semibold text-xs">
              등록된 해시태그가 없습니다.
            </p>
          )}
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
          {populars.length === 0 && (
            <p className="flex-center gap-3 py-5 bg-[#161C27] rounded-lg text-gray-400 font-semibold text-xs">
              등록된 게시물이 없습니다.
            </p>
          )}
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
