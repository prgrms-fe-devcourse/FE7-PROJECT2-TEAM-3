// components/ChatInput.tsx

import { useState, type FormEvent } from "react";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";

type ChatInputProps = {
  roomId: string;
};

export default function ChatInput({ roomId }: ChatInputProps) {
  const myProfile = useAuthStore((state) => state.profile);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 입력 내용 없거나, 로그인 안했거나, roomId 없으면 전송 불가
    if (!newMessage.trim() || !myProfile || !roomId) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage.trim(),
      user_id: myProfile._id,
      room_id: roomId,
    });

    if (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다. RLS 정책 등을 확인하세요.");
    } else {
      setNewMessage(""); // 성공 시 입력창 비우기
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="p-4 border-t border-gray-700 flex gap-2"
    >
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 p-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:border-blue-500"
        placeholder="메시지를 입력하세요..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={!newMessage.trim()}
      >
        전송
      </button>
    </form>
  );
}
