import { SquarePen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileImage from "../../components/ui/ProfileImage.tsx";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge.tsx";

type CommentProps = {
  _id: string;
  userId: string;
  author: string;
  level: number;
  profileImage?: string | null;
  time: string;
  content: string;
  isEdited?: boolean;
  isMine: boolean;
  onEditSave: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
};

const Comment = ({
  _id,
  userId,
  author,
  level,
  profileImage,
  time,
  content,
  isEdited,
  isMine,
  onEditSave,
  onDelete,
}: CommentProps) => {
  // console.log("Comment()");
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  // content prop이 바뀔 때 text state도 갱신
  useEffect(() => {
    setText(content);
  }, [content]);

  const handleEdit = () => {
    if (isEditing) {
      // 수정 중일 때 다시 수정 버튼 누르면 저장
      onEditSave(_id, text);
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex gap-3 py-4 border-b border-white/10 last:border-0">
      {/* 프로필 이미지 */}
      <Link to={`/userPage/${userId}`}>
        <ProfileImage
          className="w-16 h-16 rounded-full object-cover shrink-0"
          src={profileImage}
          alt={author + "님의 이미지"}
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap mb-1">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-semibold text-sm">{author}</span>
            <span className="text-xs font-bold text-amber-400">{`Lv.${level}`}</span>
            <Badge className="px-2 py-0.5 whitespace-nowrap" level={level} />
            <span className="text-xs text-gray-500">
              {time}
              {isEdited && " (수정됨)"}
            </span>
          </div>

          {/* 수정 / 삭제 버튼 */}
          {isMine && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-[#4A77E4] text-white text-xs hover:bg-[#3d68d0] transition"
              >
                <SquarePen className="w-4 h-4" />
                {isEditing ? "저장" : "수정"}
              </button>
              <button
                onClick={() => onDelete(_id)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-[#D94A3D] text-white text-xs hover:bg-[#c23c30] transition"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 내용 영역 */}
        {isEditing ? (
          <textarea
            aria-label="댓글 쓰는 영역"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-xl p-4 text-sm shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none mt-2"
            rows={4}
          />
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default Comment;