import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import ProfileImage from "../../components/ui/ProfileImage";
import Badge from "../../components/ui/Badge";

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
  };
};

export default function MessagesPage() {
  const myProfile = useAuthStore((state) => state.profile);
  const [chatRooms, setChatRooms] = useState<ChatRoomInboxItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!myProfile?._id) return;

      try {
        const { data: roomsData, error: roomsError } = await supabase
          .from("chat_rooms")
          .select("id, participants")
          .contains("participants", [myProfile._id]);

        if (roomsError) throw roomsError;
        if (!roomsData) return;

        const roomDetailsPromises = roomsData.map(async (room) => {
          const otherUserId = room.participants.find(
            (id: string) => id !== myProfile._id
          );
          if (!otherUserId) return null;

          // 상대방 프로필 가져오기
          const profilePromise = supabase
            .from("profiles")
            .select("display_name, profile_image, level")
            .eq("_id", otherUserId)
            .single();

          // 마지막 메시지 가져오기
          const lastMessagePromise = supabase
            .from("messages")
            .select("content, created_at")
            .eq("room_id", room.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // 동시 실행
          const [profileResult, messageResult] = await Promise.all([
            profilePromise,
            lastMessagePromise,
          ]);

          // 결과 조합
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
            },
          };
        });

        // 모든 방의 상세 정보가 로드될 때까지 기다림
        const resolvedRoomDetails = (
          await Promise.all(roomDetailsPromises)
        ).filter(Boolean) as ChatRoomInboxItem[];

        // (선택) 마지막 메시지 시간 기준으로 방 목록 정렬
        resolvedRoomDetails.sort(
          (a, b) =>
            b.lastMessage.created_at?.localeCompare(
              a.lastMessage.created_at || ""
            ) || 0
        );

        setChatRooms(resolvedRoomDetails);
      } catch (error) {
        console.error("채팅방 목록 로드 실패:", error);
      }
    };

    fetchChatRooms();
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
        <div>
          {chatRooms.map((room) => (
            <article
              key={room.roomId}
              className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] cursor-pointer hover:bg-[#171f2b] hover:border-[#4E46A5]"
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
                        ? new Date(room.lastMessage.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="max-h-23 text-[#D1D5DB] text-sm line-clamp-3">
                    {room.lastMessage.content || "메시지 없음"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
