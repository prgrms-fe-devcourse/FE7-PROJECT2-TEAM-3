import React from "react";
import { LogOut, Pencil } from "lucide-react"; // 로그아웃, 수정 아이콘

export default function ProfileHeaderSection() {
  // 💡 임시 데이터 설정 (이전과 동일)
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
  // 🚀 레벨업까지 남은 경험치 계산
  const expRemaining = profileData.maxExp - profileData.currentExp;

  return (
    <div className="w-full">
      <div className="w-full h-24 bg-gray-300 rounded-t-lg"></div>

      <div className="bg-[#161C27] rounded-b-lg p-6 shadow-lg relative">
        {/* ... (프로필 상단부: 아바타, 닉네임, 버튼) - 생략 ... */}
        <div className="flex justify-between items-center">
          {/* 아바타와 닉네임 정보 그룹 */}
          <div className="flex items-start gap-4 -mt-12">
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
          {/* 우측 버튼 그룹 */}
          {isMyProfile && (
            <div className="flex gap-2 self-start pt-2">
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

        {/* 🚀 경험치 바 섹션 재수정: 수직 플로우 정렬 */}
        <div className="flex items-center text-xs">
          {/* 1. 레벨 텍스트 (Lv.5) */}
          <div className="text-yellow-500 font-bold text-lg mr-4">
            Lv.{profileData.level}
          </div>

          {/* 2. 바와 텍스트를 담는 컨테이너: 가로 길이와 모서리 수정 */}
          {/* 💡 가로 길이를 줄이기 위해 'flex-1'을 제거하고 'w-2/5' (40%)를 적용 */}
          <div className="w-3/10 flex flex-col gap-2 mr-4">
            {/* 2-1. 경험치 바 영역 (상단) */}
            {/* 💡 h-3(세로 12px) 대신 h-4(세로 16px)를 적용하여 더 길게 만듦 */}
            <div className="bg-gray-800 rounded-sm h-4 relative overflow-hidden">
              {/* 💡 rounded-full 대신 rounded-md(중간 둥글기) 또는 rounded-sm(작은 둥글기)을 사용해 사각형 모양에 가깝게 수정 */}

              {/* 경험치 채우기 바 */}
              <div
                className="bg-[#FFC300] h-full rounded-sm transition-all duration-500" // 💡 채우기 바에도 동일하게 rounded-md 적용
                style={{ width: `${expPercentage}%` }}
              ></div>
            </div>

            {/* 2-2. 텍스트 영역 (하단) */}
            <div className="w-full flex justify-between text-sm">
              <span className="text-gray-300 font-medium whitespace-nowrap">
                레벨 {profileData.level + 1}까지 {expRemaining}exp 남음
              </span>
              <span className="text-yellow-500 font-medium whitespace-nowrap">
                총 획득 경험치 {profileData.currentExp}exp
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

      {/* 작성글 또는 댓글 리스트 영역 */}
      <div className="w-full rounded-lg p-6 mt-4 min-h-[500px]">
        {/* <Outlet /> */}
      </div>
    </div>
  );
}
