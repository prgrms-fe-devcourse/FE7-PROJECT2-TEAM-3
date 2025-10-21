import { Heart, MessageSquare, UserPlus } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "like",
    message: "사용자A님이 회원님의 게시글을 좋아합니다.",
    postTitle: "새로운 프로젝트 아이디어",
    time: "2시간 전",
  },
  {
    id: 2,
    type: "comment",
    message: "사용자B님이 회원님의 게시글에 댓글을 남겼습니다.",
    postTitle: "React 공부하기",
    time: "3시간 전",
  },
  {
    id: 3,
    type: "follow",
    message: "사용자C님이 회원님을 팔로우하기 시작했습니다.",
    postTitle: "",
    time: "5시간 전",
  },
];

export default function Notifications() {
  return (
    <div className="notifications p-4 text-gray-300">
      {notifications.length === 0 ? (
        <p>🔔 새로운 알림이 없습니다.</p>
      ) : (
        notifications.map(({ id, type, message, postTitle, time }) => (
          <div
            key={id}
            className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 text-xl">
              {type === "like" && (
                <Heart className="text-[#FF0000] fill-[#FF0000] w-5 h-5" />
              )}
              {type === "comment" && (
                <MessageSquare className="text-[#9CA3AF] fill-[#9CA3AF] w-5 h-5" />
              )}
              {type === "follow" && (
                <UserPlus className="text-green-500 fill-green-500 w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">{message}</p>
              {postTitle && (
                <p className="text-xs text-gray-400 italic">
                  게시글: {postTitle}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {time}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
