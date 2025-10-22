import { Link } from "react-router";
import { Bell, Search, UserRound } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import Notifications from "./aside/Notifications";
import SidebarContents from "./aside/SidebarContents";
import Modal from "./Modal";
import SearchModal from "./SearchModal";
import { useAuthStore } from "../stores/authStore";
import ProfileImage from "./ui/ProfileImage";
import type { NotificationJoined } from "../types/notification";
import supabase from "../utils/supabase";

export default function Sidebar() {
  const [notifications, setNotifications] = useState<NotificationJoined[]>([]);

  const [isNotiOpened, setIsNotiOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isLogined = useAuthStore((state) => state.profile);

  const openSearch = () => setIsSearchOpened(true);
  const closeSearch = () => setIsSearchOpened(false);
  const toggleNotifications = () => setIsNotiOpened((p) => !p);

  useEffect(() => {
    if (!isLogined?._id) return;

    let mounted = true;

    // ✅ 기존 알림 불러오기 (약간 지연시켜 안정성 확보)
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
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
          .eq("user_to_notify", isLogined._id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!mounted) return;

        const formatted = data.map((n) => ({
          ...n,
          actor: Array.isArray(n.actor)
            ? (n.actor[0] ?? null)
            : (n.actor ?? null),
          post: Array.isArray(n.post) ? (n.post[0] ?? null) : (n.post ?? null),
        }));

        setNotifications(formatted);
      } catch (e) {
        console.error("🔴 알림 불러오기 실패:", e);
      }
    };

    const delayedFetch = setTimeout(fetchNotifications, 300);

    // ✅ 단건 join 데이터 재조회 함수
    const fetchJoinedNotification = async (id: string, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
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
          .eq("_id", id)
          .single();

        if (!error && data?.actor) return data;
        await new Promise((r) => setTimeout(r, 300)); // 재시도 대기
      }
      return null;
    };

    // ✅ 실시간 구독 (INSERT)
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_to_notify=eq.${isLogined._id}`,
        },
        async (payload) => {
          console.log("🔔 새 알림 도착:", payload.new);

          // INSERT된 알림 단건 다시 조회
          const data = await fetchJoinedNotification(payload.new._id);
          if (!data) return;

          const formatted = {
            ...data,
            actor: Array.isArray(data.actor)
              ? (data.actor[0] ?? null)
              : (data.actor ?? null),
            post: Array.isArray(data.post)
              ? (data.post[0] ?? null)
              : (data.post ?? null),
          };

          if (mounted) {
            setNotifications((prev) => [formatted, ...prev]);
          }
        }
      )
      .subscribe();

    // ✅ cleanup
    return () => {
      mounted = false;
      clearTimeout(delayedFetch);
      supabase.removeChannel(channel);
    };
  }, [isLogined?._id]);

  return (
    <>
      <aside className="fixed right-0 bg-[#1a2537] border-l border-l-[#303A4B] lg:border-0 lg:relative w-full max-w-80 overflow-y-scroll scrollbar-hide">
        <div className="sticky top-0 flex-center gap-2 h-18 px-3 border-b border-b-[#303A4B] bg-[#1A2537]">
          <button
            className="flex-1 flex items-center gap-2 h-10 px-3 bg-[#161C27] rounded-lg text-sm font-medium text-gray-300 cursor-pointer hover:opacity-70"
            onClick={openSearch}
          >
            <Search className="w-4 h-4 stroke-gray-300" />
            Explore...
          </button>
          {isLogined && (
            <>
              <button
                className="notification flex-center relative w-10 h-10 rounded-full cursor-pointer hover:bg-[#161C27] hover:opacity-70"
                onClick={toggleNotifications}
              >
                <Bell className="w-6 h-6 stroke-gray-300 fill-gray-300" />
                {/* 알림 있을 경우 뱃지 형성 */}
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-2.5 w-2 h-2 bg-[#A62F03] border-2 border-[#1A2537] rounded-full"></span>
                )}
              </button>
              <div className="">
                <Link
                  to={`userPage/${isLogined._id}`}
                  className="block hover:opacity-70"
                >
                  {/* 프로필 이미지 src */}
                  <ProfileImage
                    className="w-10 h-10"
                    src={isLogined.profile_image}
                    alt={isLogined.display_name}
                  />
                </Link>
              </div>
            </>
          )}
          {!isLogined && (
            <Link
              to="/login"
              className="flex-center relative w-10 h-10 rounded-full cursor-pointer hover:bg-[#161C27] hover:opacity-70"
            >
              <UserRound className="w-6 h-6 stroke-gray-300" />
            </Link>
          )}
        </div>
        <Activity mode={isNotiOpened ? "visible" : "hidden"}>
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </Activity>
        <Activity mode={!isNotiOpened ? "visible" : "hidden"}>
          <SidebarContents />
        </Activity>
      </aside>
      <Modal isOpen={isSearchOpened} onClose={closeSearch}>
        <SearchModal onClose={closeSearch} />
      </Modal>
    </>
  );
}
