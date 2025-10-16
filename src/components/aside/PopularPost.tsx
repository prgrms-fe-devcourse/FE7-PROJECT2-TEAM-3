import { Heart, MessageSquare } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useRelativeTime } from "../../hooks/useRelativeTime";
import type { PopularPosts } from "../../types/posts";
import ProfileImage from "../ui/ProfileImage";

export default function PopularPost({
  post,
  liked,
}: {
  post: PopularPosts;
  liked: boolean;
}) {
  const createdText = useRelativeTime(post.created_at);
  return (
    <article className="flex gap-3 p-3 bg-[#161C27] rounded-lg cursor-pointer hover:opacity-70">
      <div className="overflow-hidden w-8 h-8 rounded-full">
        <ProfileImage
          className="w-8 h-8"
          src={post.profiles.profile_image}
          alt={post.profiles.display_name}
        />
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex items-center flex-wrap gap-x-2.5">
          <p className="text-sm text-white">{post.profiles.display_name}</p>
          <p className="text-xs text-gray-400">{createdText}</p>
        </div>
        <h3 className="font-normal text-sm text-gray-300">{post.title}</h3>
        <div className="flex gap-3">
          <p className="flex-center gap-1 text-gray-400 text-xs">
            <Heart
              className={twMerge(
                "w-3 h-3 stroke-gray-400 fill-gray-400",
                liked && "stroke-red-600 fill-red-600"
              )}
            />
            {post.likes_count}
          </p>
          <p className="flex-center gap-1 text-gray-400 text-xs">
            <MessageSquare className="w-3 h-3 stroke-gray-400 fill-gray-400" />
            {post.comments_count}
          </p>
        </div>
      </div>
    </article>
  );
}
