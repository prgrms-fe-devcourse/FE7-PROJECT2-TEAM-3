// pages/ChatRoom.tsx
import { useEffect, useState, useRef, Activity } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import ChatInput from "./ChatInput";
import ProfileImage from "../../components/ui/ProfileImage";

type MessageWithProfile = {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  room_id: string;
  profiles: {
    display_name: string;
    profile_image: string | null;
  };
};

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const myProfile = useAuthStore((state) => state.profile);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 시작할 때
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return; // roomId가 없으면 실행 중단

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          profiles (
            display_name,
            profile_image
          )
        `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("메시지 로드 실패:", error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();
  }, [roomId, myProfile?._id]);

  // 실시간 새 메시지 구독
  useEffect(() => {
    if (!roomId) return;

    const subscription = supabase
      .channel(`private-chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessageData = payload.new as Omit<
            MessageWithProfile,
            "profiles"
          >;

          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, profile_image")
            .eq("_id", newMessageData.user_id)
            .single();

          const messageWithProfile = {
            ...newMessageData,
            profiles: profile || {
              display_name: "알 수 없음",
              profile_image: null,
            },
          };
          setMessages((prevMessages) => [...prevMessages, messageWithProfile]);
        }
      )
      .subscribe();

    const markMessagesAsRead = async () => {
      if (!roomId || !myProfile?._id) return;

      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("room_id", roomId) // 현재 방
        .eq("is_read", false) // 아직 안 읽은 것만
        .neq("user_id", myProfile._id); // 내가 보낸 메시지 제외

      if (error) {
        console.error("메시지 읽음 처리 실패:", error);
      }
    };

    markMessagesAsRead();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId, messages]);

  //새 메시지가 올 때마다 자동으로 스크롤을 맨 아래로 내리는 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //"읽음"으로 처리하는 기능
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!roomId || !myProfile?._id) return;

      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("room_id", roomId) // 현재 방
        .eq("is_read", false) // 아직 안 읽은 것만
        .neq("user_id", myProfile._id); // 내가 보낸 메시지 제외

      if (error) {
        console.error("메시지 읽음 처리 실패:", error);
      }
    };

    markMessagesAsRead();
  }, [roomId, myProfile?._id]);

  return (
    <div className="flex flex-col h-[calc(95vh-60px)]">
      <div className="flex-1 overflow-y-auto p-[10px] scrollbar-hide">
        {messages.map((msg) => {
          const isMe = msg.user_id === myProfile?._id;
          return (
            <div
              key={msg.id}
              // 내가 보낸 메시지는 오른쪽, 상대방 메시지는 왼쪽에 정렬
              className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <Activity mode={!isMe ? "visible" : "hidden"}>
                <ProfileImage
                  className="w-8 h-8 rounded-full mr-2"
                  src={msg.profiles.profile_image}
                  alt={`${msg.profiles.display_name}+님의 프로필 이미지`}
                />
              </Activity>
              <div
                className={`max-w-[70%] p-2 px-3 rounded-lg ${
                  isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-semibold mb-1">
                    {msg.profiles.display_name}
                  </p>
                )}
                {msg.content}
                <p
                  className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500"} text-right`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                </p>
              </div>
              <Activity mode={isMe ? "visible" : "hidden"}>
                <ProfileImage
                  className="w-8 h-8 rounded-full ml-2"
                  src={myProfile?.profile_image}
                  alt={`${myProfile?.display_name}님의 프로필 이미지`}
                />
              </Activity>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput roomId={roomId!} />
    </div>
  );
}
