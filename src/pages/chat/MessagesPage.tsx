import { Activity, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import ProfileImage from "../../components/ui/ProfileImage";
import Badge from "../../components/ui/Badge";
import { twMerge } from "tailwind-merge";

type ChatRoomInboxItem = {
  roomId: string;
  otherParticipant: {
    id: string;
    display_name: string;
    profile_image: string | null;
    level: number | null;
  };
  lastMessage: {
    content: string | null;
    created_at: string | null;
    is_read: boolean | null;
    user_id: string | null;
  };
};

export default function MessagesPage() {
  const myProfile = useAuthStore((state) => state.profile);
  const [chatRooms, setChatRooms] = useState<ChatRoomInboxItem[]>([]);
  const navigate = useNavigate();

  //  Realtime 적용을 위해 초기 데이터 로딩 함수를 외부에 정의
  const fetchRoomList = async () => {
    if (!myProfile?._id) return;

    try {
      // 채팅방 목록 조회 (기존 로직 유지)
      const { data: roomsData, error: roomsError } = await supabase
        .from("chat_rooms")
        .select("id, participants")
        .contains("participants", [myProfile._id]);

      if (roomsError) throw roomsError;
      if (!roomsData) return;

      // 각 방의 상세 정보 (프로필, 마지막 메시지) 로드 (기존 로직 유지)
      const roomDetailsPromises = roomsData.map(async (room) => {
        const otherUserId = room.participants.find(
          (id: string) => id !== myProfile._id
        );
        if (!otherUserId) return null;

        // 상대방 프로필 가져오기 (프로필은 정적으로 유지)
        const profilePromise = supabase
          .from("profiles")
          .select("display_name, profile_image, level")
          .eq("_id", otherUserId)
          .single();

        // 마지막 메시지 가져오기 (정적으로 가져옴)
        const lastMessagePromise = supabase
          .from("messages")
          .select("content, created_at, is_read, user_id")
          .eq("room_id", room.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const [profileResult, messageResult] = await Promise.all([
          profilePromise,
          lastMessagePromise,
        ]);

        return {
          roomId: room.id,
          otherParticipant: {
            id: otherUserId,
            display_name: profileResult.data?.display_name || "알 수 없음",
            profile_image: profileResult.data?.profile_image,
            level: profileResult.data?.level,
          },
          lastMessage: {
            content: messageResult.data?.content || null,
            created_at: messageResult.data?.created_at || null,
            is_read: messageResult.data?.is_read || null,
            user_id: messageResult.data?.user_id || null,
          },
        };
      });

      const resolvedRoomDetails = (
        await Promise.all(roomDetailsPromises)
      ).filter(Boolean) as ChatRoomInboxItem[];

      resolvedRoomDetails.sort(
        (a, b) =>
          b.lastMessage.created_at?.localeCompare(
            a.lastMessage.created_at || ""
          ) || 0
      );

      setChatRooms(resolvedRoomDetails);

      return resolvedRoomDetails;
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchRoomList();

    const messageSubscription = supabase
      .channel("message_inbox_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchRoomList();
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [myProfile?._id]);

  return (
    <div>
      <div className="flex justify-between items-center p-5 pt-0 border-b border-[#303A4B]">
        <h2 className="text-xl font-bold text-white">내 메시지 목록</h2>
      </div>
      {chatRooms.length === 0 ? (
        <div className="h-64 flex justify-center items-center">
          <p className="text-gray-500 text-base">아직 대화가 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {chatRooms.map((room) => {
            // 마지막 메세지가 읽은 메세지인지 && 마지막 메세지가 내 메세지가 아닌지
            const isRead =
              !room.lastMessage.is_read &&
              room.lastMessage.user_id !== myProfile?._id;
            return (
              <article
                key={room.roomId}
                className={twMerge(
                  "flex gap-3 p-6 border rounded-lg cursor-pointer bg-[#161C27] border-[#303A4B]",
                  isRead &&
                    "border-[#0f748d] bg-[linear-gradient(180deg,_#2f3a4b_0%,_#183347)]"
                )}
                onClick={() => navigate(`/messages/${room.roomId}`)}
              >
                <div className="w-10 h-10">
                  <ProfileImage
                    className="w-full h-full"
                    src={room.otherParticipant.profile_image}
                    alt={`${room.otherParticipant.display_name}의 이미지`}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <strong className="text-white text-[16px]">
                        {room.otherParticipant.display_name}
                      </strong>
                    </div>
                    <div className="flex-center gap-2">
                      <span className="text-[#F59E0B] text-[12px]">
                        {`Lv ${room.otherParticipant.level || "0"}`}
                      </span>
                      <Badge
                        className="flex px-3 h-[17px] items-center justify-center whitespace-nowrap overflow-hidden"
                        level={room.otherParticipant.level}
                      />
                      {/* 시간 표시 부분 */}
                      <span className="text-xs text-gray-400">
                        {room.lastMessage.created_at
                          ? new Date(
                              room.lastMessage.created_at
                            ).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p
                      className={`max-h-23 ${isRead ? "text-white" : "text-gray-500"} text-sm line-clamp-3`}
                    >
                      {room.lastMessage.content || "메시지 없음"}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
