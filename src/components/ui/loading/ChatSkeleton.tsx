export default function ChatSkeleton() {
  return (
    <article className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] animate-pulse">
      {/* 1. 프로필 이미지 서클 */}
      <div className="w-10 h-10 shrink-0">
        {" "}
        {/* w-10 h-10 -> w-14 h-13 */}
        <div className="w-full h-full rounded-full bg-gray-700"></div>
      </div>

      {/* 2. 오른쪽 컨텐츠 영역 (이미지 기반) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 상단 행: 이미지처럼 3개 블록 */}
        <div className="flex items-center gap-2.5">
          {/* 이름 */}
          <div className="h-5 w-32 bg-gray-700 rounded"></div>{" "}
          {/* h-4 w-24 -> h-7 w-32 */}
          {/* 레벨 */}
          <div className="h-5 w-16 bg-gray-700 rounded"></div>{" "}
          {/* h-4 w-8 -> h-7 w-16 */}
          {/* 뱃지 */}
          <div className="h-5 w-20 bg-gray-700 rounded"></div>{" "}
          {/* h-4 w-12 -> h-7 w-20 */}
        </div>

        {/* 하단 행: 이미지처럼 1개 라인 */}
        <div>
          <div className="h-5 w-11/12 bg-gray-700 rounded"></div>{" "}
          {/* h-4 -> h-7 */}
        </div>
      </div>
    </article>
  );
}
