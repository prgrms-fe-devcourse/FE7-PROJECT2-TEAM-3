import Card from "../Card";
import Skeleton from "./Skeleton";

export default function DetailPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100 animate-pulse">
      {/* ───────────── 본문 카드 ───────────── */}
      <Card className="p-6 space-y-6">
        {/* 작성자 프로필 */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-5 rounded" />
              <Skeleton className="w-10 h-4 rounded" />
              <Skeleton className="w-12 h-5 rounded" />
            </div>
            <Skeleton className="w-32 h-3 rounded" />
          </div>
        </div>

        {/* 제목 */}
        <Skeleton className="w-2/3 h-6 rounded" />

        {/* 본문 */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-11/12 h-4 rounded" />
          <Skeleton className="w-4/5 h-4 rounded" />
        </div>

        {/* 이미지 섹션 */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* 해시태그 */}
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-14 h-5 rounded-full" />
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-12 h-5 rounded-full" />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-6">
            <Skeleton className="w-16 h-5 rounded" />
            <Skeleton className="w-16 h-5 rounded" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-16 h-8 rounded-md" />
          </div>
        </div>
      </Card>

      {/* 간격 */}
      <div className="h-6" />

      {/* ───────────── 댓글 카드 ───────────── */}
      <Card className="p-6 space-y-4">
        <Skeleton className="w-32 h-5 rounded" />
        {/* 댓글 1 */}
        <div className="flex gap-3 py-4 border-b border-white/10">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-10 h-3 rounded" />
              <Skeleton className="w-14 h-4 rounded" />
            </div>
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-4/5 h-4 rounded" />
          </div>
        </div>

        {/* 댓글 2 */}
        <div className="flex gap-3 py-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-10 h-3 rounded" />
              <Skeleton className="w-14 h-4 rounded" />
            </div>
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-3/5 h-4 rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}
