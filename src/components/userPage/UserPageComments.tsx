import { useNavigate } from "react-router";
import { NotebookPen } from "lucide-react";
import { formaRelativeTime } from "../../utils/formatRelativeTime";

interface Props {
  comments: FormattedComments[];
}

export default function UserPageComments({ comments }: Props) {
  const navigate = useNavigate();

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        아직 작성한 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {comments.map((c) => (
        <div
          key={c.post_id + c.created_at}
          onClick={() => navigate(`/posts/${c.post_id}`)}
          className="w-full p-6 border border-[#303A4B] rounded-lg bg-[#161C27] hover:bg-[#171f2b] hover:border-[#4E46A5] cursor-pointer transition"
        >
          {/* 💬 댓글 (아이콘 + 텍스트) */}
          <div className="flex items-center mb-2 text-gray-400">
            {/* <MessageSquare className="w-4 h-4 mr-2 fill-gray-400" /> */}
            {/* 💬 댓글 내용 */}
            <p className="text-white">{c.comment}</p>
          </div>

          {/* 📝 원글 제목 */}
          <h3 className="flex items-center gap-2 text-[15px] font-semibold">
            <NotebookPen className="w-4 h-4 text-[#60A5FA]" />
            <span className="text-[#9CA3AF]">원글 제목:</span>
            <span className="text-[#9CA3AF] line-clamp-1">{c.title}</span>
          </h3>

          {/* 📅 작성일 */}
          <p className="text-sm text-gray-400 mt-2">
            {formaRelativeTime(c.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
}
