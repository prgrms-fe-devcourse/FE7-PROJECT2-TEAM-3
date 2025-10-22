import { Heart, MessageSquare, UserPlus } from "lucide-react";
import supabase from "../../utils/supabase";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import type { NotificationProps } from "../../types/notification";
import { formaRelativeTime } from "../../utils/formatRelativeTime";

export default function Notifications({
  notifications,
  setNotifications,
}: NotificationProps) {
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    const fetchNotifi = async () => {
      try {
        const { data: notificationData, error } = await supabase
          .from("notifications")
          .select(
            `
            _id,
            type,
            created_at,
            is_read,
            actor:actor_id ( _id, display_name, profile_image ),
            post:target_post_id ( _id, title )
          `
          )
          .eq("user_to_notify", profile?._id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log(notificationData);
        setNotifications(notificationData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifi();
  }, [profile?._id, setNotifications]);
  return (
    <div className="notifications p-4 text-gray-300">
      {notifications.length === 0 ? (
        <p>🔔 새로운 알림이 없습니다.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 text-xl">
              {n.type === "like" && (
                <Heart className="text-[#FF0000] fill-[#FF0000] w-5 h-5" />
              )}
              {n.type === "comment" && (
                <MessageSquare className="text-[#9CA3AF] fill-[#9CA3AF] w-5 h-5" />
              )}
              {n.type === "follow" && (
                <UserPlus className="text-green-500 fill-green-500 w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-semibold">
                {n.actor?.display_name || "알 수 없는 사용자"} 님이{" "}
                {n.type === "like"
                  ? "내 게시물을 좋아합니다."
                  : n.type === "comment"
                    ? "내 게시물에 댓글을 남겼습니다."
                    : "나를 팔로우했습니다."}
              </p>

              {n.post?.title ? (
                <p className="text-xs text-gray-400 italic">
                  게시글: {n.post.title}
                </p>
              ) : n.type !== "follow" ? (
                <p className="text-xs text-gray-400 italic">게시글 정보 없음</p>
              ) : null}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {formaRelativeTime(n.created_at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
