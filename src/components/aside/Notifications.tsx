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
  toggle,
}: NotificationProps & { toggle: () => void }) {
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

        const formmated = notificationData.map((n) => ({
          ...n,
          actor: Array.isArray(n.actor)
            ? (n.actor[0] ?? null)
            : (n.actor ?? null),
          post: Array.isArray(n.post) ? (n.post[0] ?? null) : (n.post ?? null),
        }));

        setNotifications(formmated);
      } catch (e) {
        console.error(e);
      }
    };

    if (profile?._id) {
      fetchNotifi();
    }
  }, [profile?._id, setNotifications]);

  const clickHandler = async (
    type: string,
    option: string | null | undefined,
    notificationId: string
  ) => {
    if (!option) return; // option이 null/undefined면 아무 작업도 하지 않음

    if (profile?._id) {
      try {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("_id", notificationId);

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, is_read: true } : n
          )
        );
      } catch (e) {
        console.error(e);
      }
    }

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

  const deleteNotification = async (notificationId: string) => {
    setNotifications([]);
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_to_notify", notificationId);

      if (error) throw error;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex justify-between px-4 pt-4">
        <button
          className="px-3 py-1.5 rounded-md bg-[#4A77E4] text-white font-medium text-sm hover:bg-[#3d68d0]"
          onClick={toggle}
        >
          뒤로 가기
        </button>
        <button
          disabled={notifications.length === 0}
          onClick={() => {
            if (notifications.length === 0) return;
            deleteNotification(notifications[0].user_to_notify);
          }}
          className={`px-3 py-1.5 rounded-md font-medium text-sm cursor-pointer ${
            notifications.length === 0
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-[#D94A3D] text-white hover:bg-[#c23c30]"
          }`}
        >
          모두 삭제
        </button>
      </div>
      <div className="notifications p-4 text-gray-300 space-y-4">
        {notifications.length === 0 ? (
          <p>새로운 알림이 없습니다.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded-lg flex gap-3 cursor-pointer border border-transparent transition-all duration-200 ${
                n.is_read
                  ? "bg-[#1B2333]/60 filter grayscale opacity-70"
                  : "bg-[#1B2333] text-gray-300 hover:bg-[#2A3244] hover:border-[#4E46A5]"
              }`}
              onClick={() =>
                clickHandler(
                  n.type,
                  n.type === "follow" ? n.actor?._id : n.post?._id,
                  n._id
                )
              }
            >
              <div className="flex gap-3 w-full">
                <div>
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
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex justify-between">
                    <div>
                      <ProfileImage
                        src={n.actor?.profile_image}
                        alt={n.actor?.display_name || "프로필 이미지"}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-[8px] text-[#9CA4AF] whitespace-nowrap self-start">
                      {formaRelativeTime(n.created_at)}
                    </div>
                  </div>

                  <p className="text-sm text-[#9CA3AF] font-semibold">
                    <span className="text-white text-[16px]">
                      {n.actor?.display_name || "알 수 없는 사용자"}
                    </span>{" "}
                    님이{" "}
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
                    <p className="text-xs text-gray-400 italic">
                      게시글 정보 없음
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
