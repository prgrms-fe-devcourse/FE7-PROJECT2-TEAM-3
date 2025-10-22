import { Heart, MessageSquare, UserPlus } from "lucide-react";
import supabase from "../../utils/supabase";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import type { NotificationProps } from "../../types/notification";
import { formaRelativeTime } from "../../utils/formatRelativeTime";
import ProfileImage from "../ui/ProfileImage";
import { useNavigate } from "react-router";

export default function Notifications({
  notifications,
  setNotifications,
}: NotificationProps) {
  const navigate = useNavigate();
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
            user_to_notify,
            actor:actor_id ( _id, display_name, profile_image ),
            post:target_post_id ( _id, title )
          `
          )
          .eq("user_to_notify", profile?._id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log(notificationData);

        const formmated = notificationData.map((n) => ({
          ...n,
          actor: Array.isArray(n.actor)
            ? (n.actor[0] ?? null)
            : (n.actor ?? null),
          post: Array.isArray(n.post) ? (n.post[0] ?? null) : (n.post ?? null),
        }));

        console.log(formmated);
        setNotifications(formmated);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifi();
  }, [profile?._id, setNotifications]);

  const clickHandler = (type: string, option: string | null | undefined) => {
    if (!option) return; // option이 null/undefined면 아무 작업도 하지 않음

    console.log(type, option);
    switch (type) {
      case "follow":
        navigate(`/userPage/${option}`);
        break;
      case "comment":
        navigate(`/posts/${option}`);
        break;
      case "like":
        navigate(`/posts/${option}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="notifications p-4 text-gray-300 space-y-4">
      {notifications.length === 0 ? (
        <p>🔔 새로운 알림이 없습니다.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className="p-4 rounded-lg bg-[#1B2333] flex gap-3 cursor-pointer border border-transparent hover:bg-[#2A3244] hover:border-[#4E46A5] transition-all duration-200"
            onClick={() =>
              clickHandler(
                n.type,
                n.type === "follow" ? n.actor?._id : n.post?._id
              )
            }
          >
            <div className="flex items-center justify-center flex-shrink-0 w-6 h-8">
              {n.type === "like" && (
                <Heart className="text-[#FF0000] fill-[#FF0000] w-5 h-5 mx-auto" />
              )}
              {n.type === "comment" && (
                <MessageSquare className="text-[#F59E0B] fill-[#F59E0B] w-5 h-5 mx-auto" />
              )}
              {n.type === "follow" && (
                <UserPlus className="text-green-500 fill-green-500 w-5 h-5 mx-auto" />
              )}
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
              <ProfileImage
                src={n.actor?.profile_image}
                alt={n.actor?.display_name || "프로필 이미지"}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <p className="text-sm text-white font-semibold">
                {n.actor?.display_name || "알 수 없는 사용자"} 님이{" "}
                {n.type === "like"
                  ? "내 게시물을 좋아합니다."
                  : n.type === "comment"
                    ? "게시물에 댓글을 남겼습니다."
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
            <div className="text-xs text-gray-500 whitespace-nowrap self-start">
              {formaRelativeTime(n.created_at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
