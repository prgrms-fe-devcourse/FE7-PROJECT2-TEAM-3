import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../utils/supabase";
import { Search } from "lucide-react";
import type { UserProfile } from "../../types/profile";
import ProfileImage from "../../components/ui/ProfileImage";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";

export default function UserSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select(
            "display_name, level, profile_image, _id, is_online, badge, bio"
          );

        if (error) throw error;

        setAllUsers(profiles);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!query) {
      return allUsers; // 전체 목록 반환
    }
    const lowerCaseQuery = query.toLowerCase();

    return allUsers.filter((user) =>
      user.display_name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, allUsers]);

  return (
    <>
      <div className="flex flex-col gap-10 h-full">
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="flex-1 flex items-center gap-5 h-15 px-7 border border-[#303A4B] bg-[#161C27] rounded-lg text-sm font-medium text-gray-300 cursor-pointer">
            <Search className="w-5 h-5 stroke-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="사용자를 검색하세요."
              className="flex-1 bg-transparent outline-none text-gray-100 placeholder:text-gray-400"
            />
          </label>
        </form>
        {filteredUsers.length === 0 && (
          <div className="flex-center h-full bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
            <p>검색된 유저가 없습니다.</p>
          </div>
        )}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col gap-4 bg-[#1A2537]">
            {filteredUsers.map((user) => (
              <Link
                to={`/userPage/${user._id}`}
                className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] cursor-pointer hover:bg-[#171f2b] hover:border-[#4E46A5]"
              >
                <div
                  className={twMerge(
                    "relative w-15 h-15 border-4 rounded-full shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] ",
                    user.is_online
                      ? "border-[#44387D] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.5)]"
                      : "border-gray-400"
                  )}
                >
                  <ProfileImage
                    className="w-full h-full rounded-full"
                    src={user.profile_image}
                    alt={user.display_name}
                  />
                  <span
                    title={user.is_online ? "온라인" : "오프라인"}
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1A2537] 
                    ${user.is_online ? "bg-green-500" : "bg-gray-500"}`}
                  ></span>
                </div>
                <div className="flex flex-col flex-1 gap-5">
                  <div className="flex justify-between">
                    <div className="flex-center gap-3">
                      <strong className="text-white text-xl font-bold">
                        {user.display_name}
                      </strong>
                      <span className="text-[#F59E0B] text-sm">
                        Lv.{user.level}
                      </span>
                      <span className="flex px-3 h-[17px] items-center justify-center bg-[#9F9F9F] text-white text-[10px] rounded-[30px] whitespace-nowrap overflow-hidden">
                        {user.badge}
                      </span>
                    </div>
                    <button className="bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                      팔로우
                    </button>
                  </div>
                  <div className="text-[#D1D5DB] text-sm line-clamp-3 break-all">
                    <p>{user.bio}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
