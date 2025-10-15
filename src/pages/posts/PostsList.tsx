import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import defaultProfile from "../../assets/image/no_profile_image.png";

// TODO: 글쓰기 버튼을 추가해서 누르면 '/channel/${channel}/write로 이동하는 것 구현하기
// TODO: 목록을 Link로 연결해서 포스트 디테일로 연결되도록 하기 post._id를 활용

type PostListItem = {
  _id: string;
  title: string;
  created_at: string;
  content: string;
  channel_id: string;
  user: {
    display_name: string;
    profile_image: string | null;
    exp: number;
    badge?: string;
  };
  likeCount: number;
  commentCount: number;
  hashtags: string[];
};

export default function PostsList() {
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
            user:profiles (display_name,profile_image,exp, badge),
            likes (_id),
            comments (_id),
            hashtags (hashtag)`);

        if (channel) {
          query = query.eq("channel_id", channel);
        }
        const { data, error } = await query;

        if (error) throw error;

        console.log(data);

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

        console.log(formatted);
        setPosts(formatted);
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {/* <button>글쓰기</button> */}
      <div id="post-list-container">
        {posts.map((post) => {
          const profileSrc = post.user.profile_image || defaultProfile;

          return (
            <div
              key={post._id}
              className="flex w-[1024px] h-[210px] gap-3 p-6 mb-6 bg-[#161C27] rounded-[8px]"
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
                    {post.user.exp || "0"}
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
                  <div>
                    <span className="text-[#9CA3AF] mr-3">
                      ❤️ {post.likeCount}
                    </span>
                    <span className="text-[#9CA3AF] mr-3">
                      💬 {post.commentCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags?.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`#${tag} 클릭됨`);
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
      </div>
    </>
  );
}
