import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate, useParams } from "react-router";
import Posts from "../../components/Posts";
import type { PostListItem, PostSearchItem } from "../../types/post";
import PostSkeleton from "../../components/ui/loading/PostSkeleton";
import { Pencil, TriangleAlert } from "lucide-react";

export default function PostsList() {
  const navigate = useNavigate();
  const { channel } = useParams();
  const CHANNELS = [
    { id: "all", label: "전체" },
    { id: "bestCombo", label: "꿀조합" },
    { id: "new", label: "신메뉴" },
    { id: "todayPick", label: "오치추" },
    { id: "weird", label: "괴식" },
  ] as const;
  const [selectedChannel, setSelectedChannel] =
    useState<(typeof CHANNELS)[number]["id"]>("all");
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
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
            likes:likes(count),
            comments:comments(count),
            hashtags (hashtag)`
          )
          .order("created_at", { ascending: false });

        if (channel) {
          query = query.eq("channel_id", channel);
        } else {
          if (selectedChannel !== "all") {
            query = query.eq("channel_id", selectedChannel);
          } else {
            // 전체: 허용된 채널만 로드하고 싶다면 다음 주석을 해제하세요
            // query = query.in("channel_id", ["bestCombo", "new", "todayPick", "weird"]);
          }
        }
        const { data, error } = await query;

        if (error) throw error;

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
        setHasFetchedOnce(true);
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [channel, selectedChannel]);

  const formattedChannel = (str: string) => {
    switch (str) {
      case "todayPick":
        return "오치추";
      case "new":
        return "신메뉴";
      case "weird":
        return "괴식";
      case "bestCombo":
        return "꿀조합";
    }
  };

  if (isLoading && !hasFetchedOnce)
    return (
      <>
        <div className="scrollbar-hide flex gap-3 mb-6 overflow-x-auto">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChannel(c.id)}
              className={
                selectedChannel === c.id
                  ? "px-6 py-2.5 rounded-md bg-[#1F2232] border border-[#6D5DD3] text-white text-sm font-semibold shadow-[0_0_10px_rgba(109,93,211,0.4)] hover:shadow-[0_0_15px_rgba(109,93,211,0.6)] transition-all duration-200 cursor-pointer"
                  : "px-6 py-2.5 rounded-md bg-[#161C27] border border-[#303A4B] text-gray-300 text-sm font-medium hover:border-[#6D5DD3] hover:text-white hover:shadow-[0_0_8px_rgba(109,93,211,0.3)] transition-all duration-200 cursor-pointer"
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        <PostSkeleton line={3} />
      </>
    );
  return (
    <>
      {!channel && (
        <div className="scrollbar-hide flex flex-col gap-3 mb-6 overflow-x-auto">
          <h1 className="text-2xl font-bold text-white tracking-wide mb-4 border-b border-[#303A4B] pb-2">
            {"전체채널"}
          </h1>
          <div>
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChannel(c.id)}
                className={
                  selectedChannel === c.id
                    ? "px-6 py-2.5 rounded-md bg-[#1F2232] border border-[#6D5DD3] text-white text-sm font-semibold shadow-[0_0_10px_rgba(109,93,211,0.4)] hover:shadow-[0_0_15px_rgba(109,93,211,0.6)] transition-all duration-200 cursor-pointer"
                    : "px-6 py-2.5 rounded-md bg-[#161C27] border border-[#303A4B] text-gray-300 text-sm font-medium hover:border-[#6D5DD3] hover:text-white hover:shadow-[0_0_8px_rgba(109,93,211,0.3)] transition-all duration-200 cursor-pointer"
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {channel && (
        <h1 className="text-2xl font-bold text-white tracking-wide mb-4 border-b border-[#303A4B] pb-2">
          {formattedChannel(channel)}
        </h1>
      )}
      {posts.length > 0 && <Posts posts={posts} channel={channel} />}
      {posts.length <= 0 && !isLoading && (
        <div className="flex-1 flex-center flex-col h-full gap-5 bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
          <TriangleAlert className="w-20 h-20 stroke-1.5" />
          <p>게시된 게시물이 없습니다.</p>
          <button
            onClick={() =>
              navigate(channel ? `/channel/${channel}/write` : "/channel/write")
            }
            className="fixed bottom-8 right-90 bg-gray-500 hover:bg-gray-400 text-white rounded-full w-15 h-15 flex items-center justify-center shadow-lg cursor-pointer transition hover:opacity-70 text-[0px]"
          >
            글쓰기
            <Pencil />
          </button>
        </div>
      )}
    </>
  );
}
