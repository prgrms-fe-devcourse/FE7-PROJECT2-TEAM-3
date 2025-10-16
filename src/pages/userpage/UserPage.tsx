import React, { Activity, useEffect, useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import ProfileImage from "../../components/ui/ProfileImage";
import CoverImage from "../../components/ui/CoverImage";

type ProfileData = {
  _id: string;
  badge: string | null;
  bio: string | null;
  cover_image: string | null;
  display_name: string;
  email: string | null;
  exp: string | null;
  is_online: boolean | null;
  profile_image: string | null;
  level: number;
};

export default function ProfileHeaderSection() {
  const navigate = useNavigate();
  const idUrl = useParams();
  const myProfile = useAuthStore((state) => state.profile);
  const maxExp = 500;
  // 채운 경험치 계산 (총 exp/maxExp * 100)
  const [expPercentage, setExpPercentage] = useState(maxExp);
  // 남은 경험치 계산
  const [expRemaining, setExpRemaining] = useState(maxExp);
  const [profile, setProfile] = useState<ProfileData>({
    _id: "",
    badge: null,
    bio: null,
    cover_image: null,
    display_name: "",
    email: null,
    exp: null,
    is_online: null,
    profile_image: null,
    level: 0,
  });

  useEffect(() => {
    if (!myProfile) {
      navigate("/login");
      return;
    }
    if (idUrl.id) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("_id", idUrl.id)
            .single();
          if (error) {
            throw error;
          }
          setProfile(data);
          setExpPercentage(data.exp % maxExp);
          setExpRemaining(maxExp - data.exp);
        } catch (error) {
          console.log(error);
        }
      };
      fetchProfile();
    }
  }, [idUrl, myProfile, navigate, setExpPercentage, setExpRemaining]);

  return (
    <div className="w-full">
      <div className="fixed top-[104px] right-[352px] left-[352px]">
        <div className="w-full h-30 bg-gray-200 rounded-t-lg">
          <CoverImage
            className="w-full h-full object-cover"
            src={profile.cover_image}
            alt={profile.display_name + "님의 배경 이미지"}
          />
        </div>

        <div className="bg-[#161C27] rounded-b-lg p-6 shadow-lg relative">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#161C27]">
                <ProfileImage
                  className="w-full h-full object-cover"
                  src={profile.profile_image}
                  alt={profile.display_name}
                />
              </div>
              <div className="flex flex-col pt-12">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-bold">
                    {profile.display_name}
                  </span>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white whitespace-nowrap">
                    {profile.badge}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {/* 팔로잉/팔로우 수 - 임시 데이터 */}
                  <span>{22} 팔로잉</span> <span className="mx-1">·</span>{" "}
                  <span>{22} 팔로우</span>
                </div>
              </div>
            </div>
            {/* 우측 버튼 그룹 */}
            <Activity mode={idUrl.id === myProfile?._id ? "visible" : "hidden"}>
              <div className="flex gap-2 self-start pt-2">
                <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1">
                  <LogOut size={14} /> 로그아웃
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1">
                  <Pencil size={14} /> 수정
                </button>
              </div>
            </Activity>
          </div>

          <p className="text-sm text-gray-300 mt-4 mb-6">{profile.bio}</p>

          <div className="flex items-center text-xs">
            {/* 1. 레벨 텍스트 (Lv.5) */}
            <div className="text-yellow-500 font-bold text-lg mr-4">
              Lv.{profile.level}
            </div>

            {/* 2. 바와 텍스트를 담는 컨테이너: 가로 길이와 모서리 수정 */}
            <div className="w-1/2 flex flex-col gap-2 mr-4">
              {/* 2-1. 경험치 바 영역 (상단) */}
              <div className="bg-gray-800 rounded-sm h-4 relative overflow-hidden">
                {/* 경험치 채우기 바 */}
                <div
                  className="bg-[#FFC300] h-full rounded-sm transition-all duration-500" // 💡 채우기 바에도 동일하게 rounded-md 적용
                  style={{ width: `${expPercentage / 5}%` }}
                ></div>
              </div>

              {/* 2-2. 텍스트 영역 (하단) */}
              <div className="w-full flex justify-between text-sm">
                <span className="text-gray-300 font-medium whitespace-nowrap">
                  레벨 {profile.level + 1}까지 {expRemaining}exp 남음
                </span>
                <span className="text-yellow-500 font-medium whitespace-nowrap">
                  Max {maxExp}exp
                </span>
              </div>
            </div>
          </div>
          {/* 🚀 경험치 바 섹션 종료 */}
        </div>
        <div className="w-full mt-1">
          {/* 💡 mt-8로 경험치 바 아래 간격 확보 */}
          <div className="flex justify-end border-b border-gray-700">
            {/* 💡 우측 정렬 및 하단 구분선 */}
            {/* '작성글' 탭 (활성화 상태) */}
            <button className="text-sm font-medium px-4 py-2 text-white border-b-2 border-white transition-colors">
              작성글
            </button>
            {/* '댓글' 탭 (비활성화 상태) */}
            <button className="text-sm font-medium px-4 py-2 text-gray-500 hover:text-white transition-colors">
              댓글
            </button>
          </div>
        </div>
      </div>
      {/* 작성글 또는 댓글 리스트 영역 */}
      <div className="w-full rounded-lg p-6 mt-4 min-h-[500px]">
        {/* <Outlet /> */}
      </div>
    </div>
  );
}
