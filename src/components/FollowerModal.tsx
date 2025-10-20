import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useParams } from "react-router";
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
                {/* 단일 팔로워 목록 항목 */}
                <div className="flex items-start gap-4 p-4 border-b border-[#303A4B] hover:bg-[#1f2d44] transition-colors">
                  {/* 1. 프로필 이미지 */}
                  <div className="w-16 h-16 shrink-0">
                    <img
                      src={profile.profile_image || ""}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover rounded-full border border-gray-700"
                    />
                  </div>

                  {/* 2. 닉네임, 레벨, 소개 텍스트 컨테이너 (세로 정렬) */}
                  <div className="flex-grow min-w-0">
                    {/* 2-1. 닉네임 (텍스트만) */}
                    <div className="mb-0.5">
                      <span className="text-base font-semibold text-white truncate">
                        닉네임
                      </span>
                    </div>

                    {/* 2-2. 레벨 및 초급자 배지 (가로 정렬, items-center로 수직 중앙 맞춤) */}
                    <div className="flex items-center gap-2 mb-1">
                      {/* 레벨 정보 (Level: Lv.5) */}
                      <span className="text-sm font-bold text-[#FFC107]  py-0.5 ">
                        Lv.5
                      </span>

                      {/* 초급자 (Badge) */}
                      <span className="text-xs text-white bg-[#334155] px-2 py-0.5 rounded-full">
                        초급자
                      </span>
                    </div>

                    {/* 2-3. 소개 텍스트 */}
                    <p className="text-sm text-gray-400 line-clamp-2">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to ma...
                    </p>
                    {/* 3. 팔로우 버튼 */}
                    <div className="shrink-0 pt-1">
                      <button className="bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                        팔로우
                      </button>
                    </div>
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
