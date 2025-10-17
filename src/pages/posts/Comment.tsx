import { twMerge } from "tailwind-merge";
import { SquarePen, Trash2 } from "lucide-react";
type BadgeProps = { className?: string; children: React.ReactNode };
export const Badge = ({ className, children }: BadgeProps) => (
  <span
    className={twMerge(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
      "bg-gray-500/60 text-gray-100",
      className
    )}
  >
    {children}
  </span>
);

type CommentProps = {
    author: string;
    level: string;
    role: string;
    content: string;
    time: string;
    isEdited?: boolean;
  };

const Comment = ({
    author,
    level,
    role,
    content,
    time,
    isEdited,
  }: CommentProps) => (
    <div className="flex gap-3 py-4 border-b border-white/10 last:border-0">
          <div className="w-10 h-10 rounded-full bg-gray-600 shrink-0 mt-1.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap justify-between">
          <div className="flex gap-2 flex-center">
              <span className="font-semibold text-sm">{author}</span>
              <span className="text-xs font-bold text-amber-400">{level}</span>
              <Badge>{role}</Badge>
              <span className="text-xs text-gray-500">{time}{isEdited && " (수정됨)"}</span>
          </div>
          {/* 우측 수정 / 삭제 버튼 */}
          <div className="flex gap-3">
              {/* 수정 버튼 */}
              <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4A77E4] text-white font-medium text-sm hover:bg-[#3d68d0] transition"
              >
                  <SquarePen className="w-4 h-4" />
                  수정
              </button>
  
              {/* 삭제 버튼 */}
              <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#D94A3D] text-white font-medium text-sm hover:bg-[#c23c30] transition"
              >
                  <Trash2 className="w-4 h-4" />
                  삭제
              </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
      </div>
    </div>
  );
  

export default Comment;