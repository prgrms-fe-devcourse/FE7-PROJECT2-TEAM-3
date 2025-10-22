// hooks/useChatRoom.ts
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { useAuthStore } from "../stores/authStore";

const useChatRoom = () => {
  const navigate = useNavigate();
  const myProfile = useAuthStore((state) => state.profile);

  const findOrCreateChatRoom = async (otherUserId: string) => {
    if (!myProfile?._id || myProfile._id === otherUserId) {
      console.error(
        "로그인 정보가 없거나 자기 자신에게 메시지를 보낼 수 없습니다."
      );
      return;
    }

    const participants = [myProfile._id, otherUserId].sort();

    try {
      // 이미 방이 있는지 찾기
      const { data: existingRoom, error: findError } = await supabase
        .from("chat_rooms")
        .select("id")
        .contains("participants", participants)
        .maybeSingle(); // 결과가 없으면 null, 있으면 객체 하나 반환

      if (findError && findError.code !== "PGRST116") throw findError;

      let roomId: string | null = null;

      // 방이 있으면 그 방 ID 사용
      if (existingRoom) {
        roomId = existingRoom.id;
      } else {
        // 방이 없으면 새로 생성
        const { data: newRoom, error: createError } = await supabase
          .from("chat_rooms")
          .insert({ participants: participants })
          .select("id")
          .single();

        if (createError) throw createError;

        roomId = newRoom?.id ?? null;
      }

      if (roomId) {
        navigate(`/messages/${roomId}`);
      } else {
        throw new Error("채팅방 ID를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성/탐색 실패:", error);
      alert("채팅방에 입장할 수 없습니다.");
    }
  };

  return { findOrCreateChatRoom };
};

export default useChatRoom;
