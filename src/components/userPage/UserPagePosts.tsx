import { Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import ProfileImage from "../ui/ProfileImage";
import { formaRelativeTime } from "../../utils/formatRelativeTime";
import type { PostListItem } from "../../types/post";
import Badge from "../ui/Badge";

export default function UserPagePosts({
  isPostLoading,
  posts,
}: {
  isPostLoading: boolean;
  posts: PostListItem[] | null;
}) {
  const navigate = useNavigate();

  if (isPostLoading || posts === null)
    return (
      <article className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] animate-pulse mb-4">
        <div className="w-10 h-10 shrink-0">
          <div className="w-full h-full rounded-full bg-gray-700"></div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-24 bg-gray-600 rounded"></div>
            <div className="h-3 w-10 bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-700 rounded-full"></div>
            <div className="flex-1"></div>
            <div className="h-3 w-12 bg-gray-700 rounded"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-5 w-3/4 bg-gray-500 rounded"></div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-gray-700 rounded"></div>
              <div className="h-3 w-[95%] bg-gray-700 rounded"></div>
              <div className="h-3 w-[80%] bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-3">
              <div className="h-4 w-8 bg-gray-700 rounded-full"></div>
              <div className="h-4 w-8 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-12 bg-gray-700 rounded-full"></div>
              <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </article>
    );

  return (
    <>
      {posts.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          아직 작성한 글이 없습니다.
        </div>
      )}
      {posts.length > 0 && (
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
      )}
    </>
  );
}
