import { Link } from "react-router";
import NoProfileImage from "../assets/image/no_profile_image.png";
import { Bell, Search } from "lucide-react";
import type { Database } from "../types/database";
import { useState } from "react";
import Notifications from "./aside/Notifications";
import SidebarContents from "./aside/SidebarContents";
import Modal from "./Modal";
import SearchModal from "./SearchModal";

type Notification = Database["public"]["Tables"]["notification"]["Row"];

export default function Sidebar() {
  const postSearchModalHandler = () => {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotiOpened, setIsNotiOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);

  const openSearch = () => setIsSearchOpened(true);
  const closeSearch = () => setIsSearchOpened(false);
  const toggleNotifications = () => setIsNotiOpened((p) => !p);

  return (
    <>
      <aside className="w-80 border-l-[#303A4B] overflow-y-scroll scrollbar-hide">
        <div className="sticky top-0 flex-center gap-2 h-18 px-3 border-b border-b-[#303A4B] bg-[#1A2537]">
          <button
            className="flex-1 flex items-center gap-2 h-10 px-3 bg-[#161C27] rounded-lg text-sm font-medium text-gray-300 cursor-pointer hover:opacity-70"
            onClick={openSearch}
          >
            <Search className="w-4 h-4 stroke-gray-300" />
            Explore...
          </button>
          {/* 알림 있을 경우 */}
          <button
            className="notification flex-center relative w-10 h-10 rounded-full cursor-pointer hover:bg-[#161C27] hover:opacity-70"
            onClick={toggleNotifications}
          >
            <Bell className="w-6 h-6 stroke-gray-300 fill-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-2.5 w-2 h-2 bg-[#A62F03] border-2 border-[#1A2537] rounded-full"></span>
            )}
          </button>
          <div className="">
            <Link
              to="myPage"
              className="block w-10 h-10 rounded-full hover:opacity-70"
            >
              {/* 프로필 이미지 src */}
              {/* <img src="" className="w-full h-full object-cover" alt="닉네임" /> */}
              {/* 없으면 이걸로 */}
              <img
                src={NoProfileImage}
                className="w-full h-full object-cover"
                alt="유저 닉넴"
              />
            </Link>
          </div>
        </div>
        {isNotiOpened && <Notifications />}
        {!isNotiOpened && <SidebarContents />}
      </aside>
      <Modal isOpen={isSearchOpened} onClose={closeSearch}>
        <SearchModal onClose={closeSearch} />
      </Modal>
    </>
  );
}
