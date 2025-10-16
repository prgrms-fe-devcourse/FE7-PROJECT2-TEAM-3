import React from "react";
import { LogOut, Pencil } from "lucide-react"; // 로그아웃, 수정 아이콘

// 💡 이 컴포넌트는 실제 데이터(닉네임, 레벨, exp 등)를 Props나 Zustand에서 받아 사용해야 합니다.
export default function ProfileHeaderSection() {
  // 💡 임시 데이터 설정 (실제로는 useAuthStore에서 가져옵니다)
  const isMyProfile = true;
  const profileData = {
    avatarUrl: "/path/to/user/avatar.jpg",
    displayName: "닉네임",
    badge: "초심자",
    following: 25,
    followers: 33,
    bio: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    level: 5,
    currentExp: 100,
    maxExp: 300,
  };

  const expPercentage = (profileData.currentExp / profileData.maxExp) * 100;

  return (
    // 🚀 최상위 div 태그 시작
    <div className="w-full">
      {/* 1. 배경 이미지/배너 영역 (회색 부분) */}
      {/* 💡 이 부분에 배경 이미지를 넣을 때 height와 bg-cover 등을 조정해야 합니다. */}
      <div className="w-full h-40 bg-gray-300 rounded-t-lg">
        {/* 나중에 <img src="..." /> 또는 배경 스타일 추가 */}
      </div>

      {/* 2. 프로필 정보 섹션 (어두운 배경 부분) */}
      <div className="bg-[#161C27] rounded-b-lg p-6 shadow-lg relative">
        {/* 프로필 상단부: 아바타, 닉네임, 버튼 */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4 -mt-16">
            {" "}
            {/* 💡 -mt-16으로 아바타를 위로 당겨 올립니다. */}
            {/* 아바타 이미지 */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#161C27]">
              <img
                src={profileData.avatarUrl}
                alt={`${profileData.displayName}의 아바타`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* 닉네임 및 정보 */}
            <div className="flex flex-col pt-12">
              {" "}
              {/* 💡 pt-12로 텍스트 위치를 조정 */}
              <div className="flex items-center gap-2">
                <span className="text-white text-xl font-bold">
                  {profileData.displayName}
                </span>
                <div className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white whitespace-nowrap">
                  {profileData.badge}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <span>{profileData.following} 팔로잉</span>{" "}
                <span className="mx-1">·</span>{" "}
                <span>{profileData.followers} 팔로우</span>
              </div>
            </div>
          </div>

          {/* 우측 버튼 그룹 (내 프로필인 경우) */}
          {isMyProfile && (
            <div className="flex gap-2 pt-4">
              {" "}
              {/* 💡 버튼 그룹을 하단으로 내립니다. */}
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1">
                <LogOut size={14} /> 로그아웃
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1">
                <Pencil size={14} /> 수정
              </button>
            </div>
          )}
        </div>

        {/* 소개글 */}
        <p className="text-sm text-gray-300 mt-4 mb-6">{profileData.bio}</p>

        {/* 경험치 바 */}
        <div className="flex items-center text-xs justify-between">
          <div className="text-yellow-500 font-bold w-12 flex-shrink-0">
            Lv.{profileData.level}
          </div>

          <div className="flex-1 mx-4 bg-gray-700 rounded-full h-3 relative">
            {/* 경험치 채우기 바 */}
            <div
              className="bg-yellow-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${expPercentage}%` }}
            ></div>
            {/* EXP 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-between text-[10px] text-black font-medium px-2">
              <span>획득 경험치 {profileData.currentExp}exp</span>
              <span>총 필요 경험치 {profileData.maxExp}exp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    // 🚀 최상위 div 태그 종료
  );
}
