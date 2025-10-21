import { useNavigate } from "react-router";

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
    <div className="flex flex-col gap-4">
      {comments.map((c) => (
        <div
          key={c.post_id + c.created_at}
          onClick={() => navigate(`/posts/${c.post_id}`)}
          className="w-full p-4 border border-[#303A4B] rounded-lg bg-[#161C27] hover:bg-[#1c2433] cursor-pointer transition"
        >
          {/* 📅 작성일 */}
          <p className="text-sm text-gray-400 mb-1">
            {new Date(c.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>

          {/* 📝 원글 제목 */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {c.title}
          </h3>

          {/* 💬 댓글 내용 */}
          <p className="text-base text-gray-300 line-clamp-2">{c.comment}</p>
        </div>
      ))}
    </div>
  );
}
