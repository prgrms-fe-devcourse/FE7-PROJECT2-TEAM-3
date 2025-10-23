import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import ProfileImage from "../../components/ui/ProfileImage";
import Badge from "../../components/ui/Badge";
import { twMerge } from "tailwind-merge";
import ChatSkeleton from "../../components/ui/loading/ChatSkeleton";
import { MailX, UserRoundX } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoomList = async () => {
    if (!myProfile?._id) {
      setChatRooms([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 채팅방 목록 불러오기
      const { data: roomsData, error: roomsError } = await supabase
        .from("chat_rooms")
        .select("id, participants")
        .contains("participants", [myProfile._id]);

      if (roomsError) throw roomsError;
      if (!roomsData) return setChatRooms([]);

      // 각 방의 상세 데이터 병렬 요청
      const roomDetailsPromises = roomsData.map(async (room) => {
        const otherUserId = room.participants.find(
          (id: string) => id !== myProfile._id
        );
        if (!otherUserId) return null;

        const [profileResult, messageResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("display_name, profile_image, level")
            .eq("_id", otherUserId)
            .single(),
          supabase
            .from("messages")
            .select("content, created_at, is_read, user_id")
            .eq("room_id", room.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
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

      const resolvedRooms = (await Promise.all(roomDetailsPromises)).filter(
        Boolean
      ) as ChatRoomInboxItem[];

      resolvedRooms.sort(
        (a, b) =>
          b.lastMessage.created_at?.localeCompare(
            a.lastMessage.created_at || ""
          ) || 0
      );

      setChatRooms(resolvedRooms);
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomList();

    // 실시간 메시지 구독
    const subscription = supabase
      .channel("message_inbox_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchRoomList();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [myProfile?._id]);

  // === 렌더링 부분 ===
  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center p-5 pt-0 border-b border-[#303A4B]">
          <h2 className="text-xl font-bold text-white">내 메시지 목록</h2>
        </div>
        <div className="flex flex-col gap-4">
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
        </div>
      </>
    );
  }

  if (!myProfile) {
    return (
      <div className="h-full flex-center flex-col gap-5 bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
        <UserRoundX className="w-20 h-20 stroke-1.5" />
        <p>
          로그인 유저만 사용 가능합니다.
        </p>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="h-full flex-center flex-col gap-5 bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
        <MailX className="w-20 h-20 stroke-1.5" />
        <p>아직 대화가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center p-5 pt-0 border-b border-[#303A4B]">
        <h2 className="text-xl font-bold text-white">내 메시지 목록</h2>
      </div>

      <div className="flex flex-col gap-4">
        {chatRooms.map((room) => {
          const isUnread =
            !room.lastMessage.is_read &&
            room.lastMessage.user_id !== myProfile?._id;

          return (
            <article
              key={room.roomId}
              onClick={() => navigate(`/messages/${room.roomId}`)}
              className={twMerge(
                "flex gap-3 p-6 border rounded-lg cursor-pointer bg-[#161C27] border-[#303A4B] transition-all duration-200",
                isUnread &&
                  "border-[#0f748d] bg-[linear-gradient(180deg,_#2f3a4b_0%,_#183347)]"
              )}
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
                  <strong className="text-white text-[16px]">
                    {room.otherParticipant.display_name}
                  </strong>
                  <span className="text-[#F59E0B] text-[12px]">
                    {`Lv ${room.otherParticipant.level || "0"}`}
                  </span>
                  <Badge
                    className="flex px-3 h-[17px] items-center justify-center whitespace-nowrap overflow-hidden"
                    level={room.otherParticipant.level}
                  />
                  <span className="text-xs text-gray-400 ml-auto">
                    {room.lastMessage.created_at
                      ? new Date(room.lastMessage.created_at).toLocaleString()
                      : ""}
                  </span>
                </div>

                <p
                  className={`max-h-23 ${
                    isUnread ? "text-white" : "text-gray-500"
                  } text-sm line-clamp-3`}
                >
                  {room.lastMessage.content || "메시지 없음"}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
