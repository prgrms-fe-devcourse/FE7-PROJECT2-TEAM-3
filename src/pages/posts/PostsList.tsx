import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate, useParams } from "react-router";
import defaultProfile from "../../assets/image/no_profile_image.png";
import { Heart, MessageSquare, Pencil } from "lucide-react";
import { twMerge } from "tailwind-merge";

// TODO: 나중에 타입 가져와서 사용하고, 컴포넌트로 빼서 리팩터링하기
type PostListItem = {
  _id: string;
  title: string;
  created_at: string;
  content: string;
  channel_id: string;
  user: {
    display_name: string;
    profile_image: string | null;
    level: number;
    badge?: string;
  };
  likeCount: number;
  commentCount: number;
  hashtags: string[];
};

const pastelColors = [
  "bg-[#A5D8FF]", // 하늘
  "bg-[#FFD6A5]", // 살구
  "bg-[#FDFFB6]", // 노랑
  "bg-[#CAFFBF]", // 연두
  "bg-[#FFADAD]", // 핑크
];

export default function PostsList() {
  const navigate = useNavigate();
  const { channel } = useParams();
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase.from("posts").select(`
            _id,
            title,
            content,
            channel_id,
            created_at,
            user:profiles (display_name,profile_image,level, badge),
            likes (_id),
            comments (_id),
            hashtags (hashtag)`);

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

  return (
    <>
      {/* <button>글쓰기</button> */}
      <div id="post-list-container">
        {posts.map((post) => {
          const profileSrc = post.user.profile_image || defaultProfile;

          return (
            <div
              key={post._id}
              className="flex w-full h-[210px] gap-3 p-6 mb-6 bg-[#161C27] rounded-[8px] cursor-pointer"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <div id="user-image">
                <img
                  src={profileSrc}
                  alt={`${post.user.display_name}의 프로필 이미지`}
                  className="h-10 w-10"
                />
              </div>

              <div id="user-data" className="flex-1 h-[168px]">
                <div id="heading" className="flex items-center mb-4">
                  <span className="text-white text-[16px] font-bold pr-[10px]">
                    {post.user.display_name}
                  </span>
                  <span className="text-[#F59E0B] text-[12px] pr-2">
                    {`Lv ${post.user.level || "0"}`}
                  </span>
                  <div className="inline-flex w-[44px] h-[17px] items-center justify-center bg-[#9F9F9F] text-white text-[10px] rounded-[30px] whitespace-nowrap overflow-hidden">
                    {post.user.badge || "정보 없음"}
                  </div>
                </div>

                <div id="content" className="flex flex-col h-[92px] mb-4">
                  <span className="text-white text-[18px] mb-3">
                    {post.title.length > 50
                      ? post.title.slice(0, 50) + "..."
                      : post.title}
                  </span>
                  <span className="text-[#D1D5DB] text-[14px]">
                    {post.content.length > 400
                      ? post.content.slice(0, 400) + "..."
                      : post.content}
                  </span>
                </div>

                <div id="footer" className="h-[18px] flex justify-between">
                  <div className="flex gap-3">
                    <p className="flex-center gap-1 text-gray-400 text-xs">
                      <Heart
                        width={18}
                        height={18}
                        className={twMerge(
                          "stroke-red-600",
                          post.likeCount > 0 && "fill-red-600"
                        )}
                      />
                      {post.likeCount}
                    </p>
                    <p className="flex-center gap-1 text-gray-400 text-xs">
                      <MessageSquare
                        width={16}
                        height={16}
                        className="stroke-gray-400 fill-gray-400"
                      />
                      {post.commentCount}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.hashtags?.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-[#2563EB] cursor-pointer bg-[#EFF6FF] text-xs font-medium px-2 py-1 rounded-full hover:bg-[#DBEAFE] transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button
          onClick={() =>
            navigate(channel ? `/channel/${channel}/write` : "/channel/write")
          }
          className="fixed bottom-8 right-90 bg-gray-500 hover:bg-gray-400 text-white rounded-full w-15 h-15 flex items-center justify-center shadow-lg cursor-pointer transition"
        >
          <Pencil />
        </button>
      </div>
    </>
  );
}
