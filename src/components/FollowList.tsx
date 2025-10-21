import { Activity, useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";
import supabase from "../utils/supabase";
import ProfileImage from "./ui/ProfileImage";

type FollowerProfile = {
  _id: string;
  display_name: string;
  profile_image: string | null;
  bio: string | null;
  badge: string | null;
  level: number;
};

export default function FollowList({
  profile,
  onClose,
}: {
  profile: FollowerProfile;
  onClose: () => void;
}) {
  const myProfile = useAuthStore((state) => state.profile);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const navigate = useNavigate();

  const directUserPage = (profileData: FollowerProfile) => {
    navigate(`/userPage/${profileData._id}`);
    onClose();
  };

  //팔로우 하는 함수
  const followSubmit = async () => {
    if (!myProfile?._id || myProfile._id === profile._id) return;
    try {
      const { data, error } = await supabase
        .from("follows")
        .insert([{ follower_id: myProfile._id, following_id: profile._id }])
        .select();
      if (data) {
        setIsFollowing(true);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };
  //언팔로우 하는 함수
  const unfollowSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", myProfile?._id)
        .eq("following_id", profile._id)
        .select();
      if (data) {
        setIsFollowing(false);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profile._id) {
      const fetchfollows = async () => {
        const { count: isFollowingData } = await supabase
          .from("follows")
          .select("", { count: "exact", head: true })
          .eq("follower_id", myProfile?._id)
          .eq("following_id", profile._id);
        setIsFollowing(isFollowingData === 1 || false);
      };
      fetchfollows();
    }
  }, [myProfile?._id, profile._id]);

  return (
    <>
      <div>
        <div className="p-0 max-h-[400px] overflow-y-auto">
          <div className="flex items-start gap-4 p-4 border-b border-[#303A4B] hover:bg-[#1f2d44] transition-colors">
            <div
              onClick={() => directUserPage(profile)}
              className="w-16 h-16 shrink-0"
            >
              <ProfileImage
                className="w-full h-full object-cover rounded-full border border-gray-700"
                src={profile.profile_image}
                alt={profile.display_name + "님의 프로필 이미지"}
              />
            </div>

            <div className="flex-grow min-w-0">
              <div className="mb-1">
                <span className="text-base font-semibold text-white truncate">
                  {profile.display_name}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-[#FFC107]  py-0.5 ">
                  Lv.{profile.level}
                </span>

                <span className="text-xs text-white bg-[#334155] px-2 py-0.5 rounded-full">
                  {profile.badge}
                </span>
              </div>

              <p className="text-sm text-gray-400 overflow-hidden text-ellipsis display-box line-clamp-2 ">
                {profile.bio}
              </p>
            </div>

            <Activity
              mode={
                myProfile && profile._id !== myProfile?._id && !isFollowing
                  ? "visible"
                  : "hidden"
              }
            >
              <div className="shrink-0 pt-1">
                <button
                  onClick={followSubmit}
                  className="bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  팔로우
                </button>
              </div>
            </Activity>
            <Activity
              mode={
                myProfile && profile._id !== myProfile?._id && isFollowing
                  ? "visible"
                  : "hidden"
              }
            >
              <div className="shrink-0 pt-1">
                <button
                  onClick={unfollowSubmit}
                  className="bg-[#9297AC] hover:bg-[#696F86] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  팔로잉
                </button>
              </div>
            </Activity>
          </div>
        </div>
      </div>
    </>
  );
}
