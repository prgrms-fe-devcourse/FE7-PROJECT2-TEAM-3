import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import defaultProfile from "../../assets/image/no_profile_image.png";

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
    badges?: string;
  };
  likeCount: number;
  commentCount: number;
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
            user:profiles (display_name,profile_image,exp, badges),
            likes (_id),
            comments (_id)`);

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
          user: post.user ?? { display_name: "", profile_image: null, exp: 0 },
          likeCount: Array.isArray(post.likes) ? post.likes.length : 0,
          commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
        }));

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

              <div id="user-data" className="flex-1 h-[162px]">
                <div id="heading" className="flex items-center mb-4">
                  <span className="text-white text-[16px] font-bold pr-[10px]">
                    {post.user.display_name}
                  </span>
                  <span className="text-[#F59E0B] text-[12px] pr-2">
                    {post.user.exp || "0"}
                  </span>
                  <div className="inline-flex w-[44px] h-[17px] items-center justify-center bg-[#9F9F9F] text-white text-[10px] rounded-[30px] whitespace-nowrap overflow-hidden">
                    {post.user.badges || "정보 없음"}
                  </div>
                </div>
                <div id="content" className="flex flex-col h-[92px] mb-4">
                  <span className="text-white text-[18px] mb-3">
                    {post.title}
                  </span>
                  <span className="text-[#D1D5DB]">{post.content}</span>
                </div>
                <div id="footer" className="h-[18px]">
                  <span className="text-[#9CA3AF] mr-3">
                    ❤️ {post.likeCount}
                  </span>
                  <span className="text-[#9CA3AF] mr-3">
                    💬 {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
