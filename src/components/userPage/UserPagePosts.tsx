import { Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import ProfileImage from "../ui/ProfileImage";
import { formaRelativeTime } from "../../utils/formatRelativeTime";
import type { PostListItem } from "../../types/post";
import Badge from "../ui/Badge";

export default function UserPagePosts({ posts }: { posts: PostListItem[] }) {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        아직 작성한 글이 없습니다.
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-6">
        {posts.map((post) => {
          return (
            <article
              key={post._id}
              className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] cursor-pointer hover:bg-[#171f2b] hover:border-[#4E46A5]"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <div className="w-10 h-10">
                <ProfileImage
                  className="w-full h-full"
                  src={post.user.profile_image}
                  alt={`${post.user.display_name}의 이미지`}
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div>
                    <strong className="text-white text-[16px]">
                      {post.user.display_name}
                    </strong>
                  </div>
                  <div className="flex-center gap-2">
                    <span className="text-[#F59E0B] text-[12px]">
                      {`Lv ${post.user.level || "0"}`}
                    </span>
                    <Badge
                      className="flex px-3 h-[17px] items-center justify-center whitespace-nowrap overflow-hidden"
                      level={post.user.level}
                    />
                    {/* 시간 표시 부분 */}
                    <span className="text-xs text-gray-400">
                      {formaRelativeTime(post.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="line-clamp-1 text-white text-[18px]">
                    {post.title}
                  </h3>
                  <p className="max-h-23 text-[#D1D5DB] text-sm line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <p className="flex-center gap-1 text-gray-400 text-xs">
                      <Heart className="w-4.5 h-4.5 stroke-gray-400 fill-gray-400" />
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
                        className="block text-[#2563EB] cursor-pointer bg-[#EFF6FF] text-xs font-medium px-2 py-1 rounded-full hover:bg-[#DBEAFE] transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
