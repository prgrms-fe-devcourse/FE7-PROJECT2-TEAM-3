import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate, useParams } from "react-router";
import { X } from "lucide-react"; // 아이콘 임포트

type SetUpModalProps = {
  onClose: () => void;
};
type FollowerProfile = {
  _id: string;
  display_name: string;
  profile_image: string | null;
  bio: string | null;
  badge: string | null;
  level: number;
};

export default function FollowerModal({ onClose }: SetUpModalProps) {
  const { userId } = useParams();
  const [profiles, setProfiles] = useState<FollowerProfile[]>([]);
  const navigate = useNavigate();

  const directUserPage = (profileData: FollowerProfile) => {
    navigate(`/userPage/${profileData._id}`);
    onClose();
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const { data, error } = await supabase
          .from("follows")
          .select(
            `
          follower_id, 
          follower_id (
            _id,
            display_name,
            profile_image,
            bio,
            badge,
            level
          )
        `
          )
          .eq("following_id", userId);

        if (data) {
          const profileData = data
            .map((follow) => follow.follower_id)
            .filter((profile): profile is FollowerProfile => profile !== null);

          setProfiles(profileData);
        }

        if (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowers();
  }, [userId]);
  console.log(profiles);
  return (
    <div>
      <div className="flex justify-between items-center p-5 border-b border-[#303A4B]">
        <h2 className="text-xl font-bold text-white">팔로워 목록</h2>
        {/* 닫기 버튼 (X 아이콘을 직접 가정하여 classNameName만 적용) */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      {profiles.length === 0 && (
        <div className="h-64 flex justify-center items-center">
          <p className="text-gray-500 text-base">팔로워가 없습니다.</p>
        </div>
      )}
      <div>
        {profiles.map((profile) => {
          return (
            <div key={profile._id}>
              <div className="p-0 max-h-[400px] overflow-y-auto">
                <div className="flex items-start gap-4 p-4 border-b border-[#303A4B] hover:bg-[#1f2d44] transition-colors">
                  <div
                    onClick={() => directUserPage(profile)}
                    className="w-16 h-16 shrink-0"
                  >
                    <img
                      src={profile.profile_image || ""}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover rounded-full border border-gray-700"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="mb-1">
                      <span className="text-base font-semibold text-white truncate">
                        닉네임{profile.display_name}
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

                    <p className="text-sm text-gray-400 line-clamp-2 ">
                      {profile.bio}
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <button className="bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                      팔로우
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
