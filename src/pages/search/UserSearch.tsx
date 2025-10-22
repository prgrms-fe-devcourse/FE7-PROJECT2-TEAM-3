import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../utils/supabase";
import { Search, TriangleAlert } from "lucide-react";
import type { UserProfile } from "../../types/profile";
import ProfileImage from "../../components/ui/ProfileImage";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import UserSearchSkeleton from "../../components/ui/loading/UserSearchSkeleton";
import Badge from "../../components/ui/Badge";

export default function UserSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const myProfile = useAuthStore((state) => state.profile);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 목록과 팔로우 목록을 동시에 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 사용자 목록 조회
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(
            "display_name, level, profile_image, _id, is_online, badge, bio"
          );

        if (profilesError) throw profilesError;

        // 로그인 했을 때는 본인을 제외한 목록 출력하기
        if (myProfile) {
          setAllUsers(
            profiles.filter((profile) => profile._id !== myProfile._id)
          );

          // 팔로우 목록 조회
          const { data: follows, error: followsError } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", myProfile._id);

          if (followsError) throw followsError;

          if (follows) {
            setFollowingIds(
              new Set(follows.map((follow) => follow.following_id))
            );
          }
        } else {
          setAllUsers(profiles);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [myProfile]);

  const filteredUsers = useMemo(() => {
    if (!query) return allUsers;

    const lowerCaseQuery = query.toLowerCase();
    return allUsers.filter((user) =>
      user.display_name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, allUsers]);

  const toggleFollow = async (userId: string) => {
    if (!myProfile?._id || myProfile._id === userId) return;

    const isFollowing = followingIds.has(userId);

    setFollowingIds((prev) => {
      const newSet = new Set(prev);
      if (isFollowing) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", myProfile._id)
          .eq("following_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert([{ follower_id: myProfile._id, following_id: userId }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error(error);

      setFollowingIds((prev) => {
        const newSet = new Set(prev);
        if (isFollowing) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 min-h-full">
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
        <UserSearchSkeleton line={3} />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-10 min-h-full">
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
          <div className="flex-1 flex-center flex-col gap-5 bg-[#1A2537] border border-[#303A4B] rounded-lg text-gray-500">
            <TriangleAlert className="w-20 h-20 stroke-1.5" />
            <p>검색된 유저가 없습니다.</p>
          </div>
        )}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col gap-4 bg-[#1A2537]">
            {filteredUsers.map((user) => {
              const isFollowing = followingIds.has(user._id);

              return (
                <Link
                  key={user._id}
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
                        <Badge
                          className="flex px-3 h-[17px] items-center justify-center whitespace-nowrap overflow-hidden"
                          level={user.level}
                        />
                      </div>
                      {myProfile && (
                        <button
                          className={twMerge(
                            "font-bold py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap h-fit",
                            isFollowing
                              ? "bg-gray-600 hover:bg-gray-700 text-white"
                              : "bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFollow(user._id);
                          }}
                        >
                          {isFollowing ? "언팔로우" : "팔로우"}
                        </button>
                      )}
                    </div>
                    <div className="text-[#D1D5DB] text-sm line-clamp-3 break-all">
                      <p>{user.bio}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
