import React, { useState, useEffect, type FormEvent } from "react";
import { twMerge } from "tailwind-merge";
import { MessageSquare, Heart, SquarePen, Trash2 } from "lucide-react";
import Comment, { Badge } from "./Comment";
import { useParams } from "react-router";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router";
import { formaRelativeTime } from "../../utils/formatRelativeTime";
import ProfileImage from "../../components/ui/ProfileImage.tsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// 공통 카드 (shadow 제거 + 지정 배경색)
const Card = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => (
  <div
    className={twMerge(
      "rounded-2xl border border-white/10 bg-[#1A1D25]",
      "backdrop-blur-sm",
      className
    )}
  >
    {children}
  </div>
);

export default function DetailPost() {
    console.log("DetailPost()");
    const navigate = useNavigate();
    const goBackHandler = () => {
      navigate(-1);
    };

    // 사용자 & 로그인
    const [userId, setUserId] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isMyPost, setIsMyPost] = useState<boolean>(false);

    // 글쓴이 영역
    const [writerId, setWriterId] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [nickname, setNickname] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [badge, setBadge] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<string>("");
    
    // 본문 영역
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
    const [hashtags, setHashtags] = useState<string[]>([])
 
    // 좋아요 & 댓글
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [newComment, setNewComment] = useState<string>('');

    type CommentProfile = {
      display_name: string;
      profile_image: string | null;
      exp: number;
      badge: string;
      level: number;
    };
    
    type CommentType = {
      _id: string;
      post_id: string;
      created_at: string;
      user_id: string;
      comment: string;
      update_at: string | null;
      profiles: CommentProfile;
    };

    const [comments, setComments] = useState<CommentType[]>([]);
    // const [commentsCount, setCommentsCount] = useState(0);
    const params = useParams();
    
    // 사용자 정보 및 게시글 가져오기
    useEffect(() => {
      const fetchData = async () => {
        try {
          // 사용자 정보 조회
          const {
            data: { user },
          } = await supabase.auth.getUser();
          console.log("DP: auth");
          if (!user) {
            setIsLogin(false);
            return;
          }
    
          const { data: profile } = await supabase
            .from("profiles")
            .select("_id, email")
            .eq("email", user.email)
            .single();
          console.log("DP: get Profiles");
          if (!profile) throw new Error("프로필 정보를 찾을 수 없습니다.");
    
          setUserId(profile._id);
          setIsLogin(true);
    
          // 게시글 조회
          const { data: post, error } = await supabase
            .from("posts")
            .select("_id, user_id, title, content, created_at")
            .eq("_id", params?.postId)
            .single();
            console.log("DP: get Post");
          if (error) throw error;
    
          setTitle(post.title);
          setContent(post.content);
          setCreatedAt(post.created_at);
          setWriterId(post.user_id);
          setIsMyPost(post.user_id === profile._id);
    
        } catch (e) {
          console.error("데이터 로드 중 오류:", e);
          alert(`데이터 로드 중 오류가 발생했습니다.\n${(e as Error).message}`);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("_id, email")
          .eq("email", user.email)
          .single();
          console.log("DP: get writerId");
        if (error) {
          console.error("글쓴이 프로필 불러오기 실패:", error);
        } else {
          setNickname(profile.display_name);
          setProfileImage(profile.profile_image);
          setLevel(profile.level);
          setBadge(profile.badge);
        }
      };
      fetchProfile();
    }, [writerId]);

    // 본문 이미지 가져오기
    useEffect(() => {
      const fetchImage = async () => {
        const { data: imageRows, error } = await supabase
        .from("images")
        .select("src")
        .eq("post_id", params?.postId);
        console.log("DP: get Images");

        if (error) {
          console.error("이미지 불러오기 실패:", error);
        } else if (imageRows) {
          // src 필드만 추출해서 상태에 넣기
          const imageSrcList = imageRows.map((img) => img.src);
        
          // 이미지 배열을 최대 4칸 구조에 맞게 채우기
          const updatedImages = Array(4)
            .fill(null)
            .map((_, idx) => imageSrcList[idx] || null);
        
          setImages(updatedImages);
        }
      }
    };
    fetchImage();
  }, [params?.postId]);

  // 해시태그 가져오기
  useEffect(() => {
    const fetchHashtags = async () => {
      const { data: hashtag, error } = await supabase
        .from("hashtags")
        .select("hashtag")
        .eq("post_id", params?.postId)
        console.log("DP: get Hashtags");

      if (error) {
        console.error("해시태그 불러오기 실패:", error);
      } else {
        setHashtags(hashtag.map((h) => h.hashtag));
      }
    };
    fetchHashtags();
  }, [params?.postId]);

  // 하트 가져오기
  useEffect(() => {
    const fetchLikes = async () => {
      const { data: likes, error } = await supabase
      .from("likes")
      .select("user_id")
      .eq("post_id", params?.postId);
      console.log("DP: get Likes");
      if (error) {
        console.error("좋아요 불러오기 실패:", error);
      } else {
        setLikeCount(likes.length);
        setLiked(!!likes.find((entry) => entry.user_id === userId));
      }
    };
    fetchLikes();
  }, [params?.postId, userId]);

  // 댓글 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      const { data: commentsObj, error } = await supabase
        .from("comments")
        .select(
          `
              _id,
              post_id,
              created_at,
              user_id,
              comment,
              update_at,
              profiles: user_id (
                display_name,
                profile_image,
                level,
                badge
              ) `)
      .eq("post_id", params?.postId)
      .order("created_at", { ascending: true });
      console.log("DP: get Comments");

      if (error) {
        console.error("댓글 불러오기 실패:", error);
      } else {
        if (commentsObj) setComments(commentsObj);
      }
    };
    fetchComments();
  }, [params?.postId]);

  // 좋아요 토글 기능
  const toggleLike = async () => {
    if (!userId) {
      toast.success("로그인 후 이용해주세요.");
      return;
    }

    setAnimating(true);

    try {
      if (liked) {
        // 이미 좋아요한 경우 → 삭제
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq("user_id", userId)
          .eq("post_id", params?.postId)
          .select();
          console.log("DP: delete Like");
        if (deleteError) throw  deleteError;
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        // 좋아요 안 한 경우 → 등록
        const { error: insertError } = await supabase
          .from("likes")
          .insert([{ user_id: userId, post_id: params?.postId }]);
          console.log("DP: update Like");
        if (insertError) throw insertError;
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error("좋아요 처리 중 오류:", e);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };
  
    // 댓글 등록 함수
    const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newComment.trim() || !userId || !params?.postId) return;
    
      try {
        // 댓글 등록 (ID만 가져오기)
        const { data: inserted, error: insertError } = await supabase
          .from("comments")
          .insert([{ post_id: params.postId, user_id: userId, comment: newComment.trim() }])
          .select("_id")
          .single();
          console.log("DP: get Comment ID");

        if (insertError || !inserted) throw insertError;
    
        // 전체 정보 다시 조회
        const { data: commentData, error: selectError } = await supabase
          .from("comments")
          .select(`
            _id,
            post_id,
            created_at,
            user_id,
            comment,
            update_at,
            profiles:user_id (
              display_name,
              profile_image,
              exp,
              badge,
              level
            )
          `)
          .eq("_id", inserted._id)
          .single();
          console.log("DP: get Comment Data");

        if (selectError || !commentData) throw selectError;

        // 상태 업데이트
        setComments((prev) => [...prev, commentData]);
        setNewComment("");
        
        // 경험치 업데이트
        let newExp = (commentData.profiles?.exp || 0) + 15; // 댓글 등록 시 경험치 +15
        let newLevel = commentData.profiles?.level || 0;

        // 레벨업 조건 체크
        if (newExp >= 100) {
          if (newLevel < 10) {
            newLevel += 1; // 레벨 +1
            newExp = newExp % 100; // 경험치 초기화
          } else {
            newExp = 100;
          }
        }

        // 업데이트 쿼리 실행
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ exp: newExp, level: newLevel })
          .eq("_id", userId);
          console.log("DP: update EXP");

        if (updateError) throw updateError;
    
      } catch (err) {
        console.error("댓글 등록 중 오류:", err);
        alert("댓글 등록 중 문제가 발생했습니다.");
      }
    };

    // 댓글 수정
    const handleCommentEdit = async (_id: string, newText: string) => {
      const { error } = await supabase
        .from("comments")
        .update({ comment: newText, update_at: new Date().toISOString() })
        .eq("_id", _id);
        console.log("DP: update Comment");

      if (!error) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === _id ? { ...c, comment: newText, update_at: new Date().toISOString() } : c
          )
        );
      }
    };

  const handleCommentDelete = async (_id: string) => {
    const ok = confirm("정말 삭제하시겠어요?");
    if (!ok) return;

    const handleCommentDelete = async (_id: string) => {
      const ok = confirm("정말 삭제하시겠어요?");
      if (!ok) return;
  
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("_id", _id)
        .eq("user_id", userId);
        console.log("DP: delete Comment");

      if (error) {
        console.error(error);
      } else {
        setComments((prev) => prev.filter((c) => c._id !== _id));
      }
    };

    const handleDelete = async () => {
      const { error } = await supabase
      .from('posts')
      .delete() // 삭제
      .eq("_id", params?.postId);
      console.log("DP: delete POST");
      goBackHandler();
      if (error) {
        console.error(error);
      }
    }

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      {/* ───────────── 본문 카드 ───────────── */}
      <Card className="p-6">
        {/* 작성자 프로필 */}
        <div className="flex items-center gap-4">
          <Link to={`/userPage/${writerId}`}>
            <ProfileImage
              className="w-16 h-16 rounded-full object-cover shrink-0"
              src={profileImage}
              alt={`${writerId}님의 이미지`}
            />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-extrabold leading-none">
                {nickname}
              </h3>
              <span className="text-sm font-bold text-amber-400">{`Lv ${level || "0"}`}</span>
              <Badge>{badge || "정보 없음"}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              {formaRelativeTime(createdAt)}
            </p>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="mt-6 text-xl font-semibold leading-snug">{title}</h1>

        {/* 본문 */}
        <div className="mt-4 space-y-4 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {content}
        </div>

        {/* 간격 */}
        <div className="h-4" />

        {/* 이미지 */}
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {images.map((img, idx) => {
              if (!img) return null;
              const imageLength = images.filter(Boolean).length;
              const baseClass =
                "relative flex flex-col items-center justify-center w-full border border-[#D1D5DB] rounded-md cursor-pointer hover:border-blue-400 transition";
              const additionClass =
                imageLength === 1
                  ? "h-80 col-span-2"
                  : imageLength === 2
                    ? "h-80 col-span-1"
                    : "h-40";

              return (
                <div key={idx} className={twMerge(baseClass, additionClass)}>
                  <img
                    src={img}
                    alt={`uploaded ${idx + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 해시태그 */}
        <div
          className={twMerge(
            "mt-4 mb-[10px] w-full transition-all duration-100", // ✅ 본문과의 간격 mt-4 추가
            hashtags.length > 0 ? "h-[20px]" : "h-0"
          )}
        >
          {hashtags.map((tag, idx) => {
            const pastelColors = [
              "bg-[#E0F7FA] text-[#027A9B]",
              "bg-[#D8F5E0] text-[#2E7D32]",
              "bg-[#FFE5D0] text-[#D84315]",
              "bg-[#FFF1F7] text-[#C2185B]",
              "bg-[#FFF9C4] text-[#B78900]",
            ];
            return (
              <span
                key={idx}
                className={twMerge(
                  "inline-flex gap-1 px-2 py-[2px] rounded-full mr-2",
                  pastelColors[idx % pastelColors.length]
                )}
              >
                #{tag}
              </span>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex items-center justify-between pt-4">
          {/* 좌측 좋아요 / 댓글 버튼 */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <button
              onClick={toggleLike}
              className="flex items-center gap-1 focus:outline-none select-none"
            >
              <Heart
                className={twMerge(
                  "w-4 h-4 transition-transform duration-300",
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 fill-transparent",
                  animating && "scale-125"
                )}
              />
              {likeCount}
            </button>

            <button className="flex items-center gap-1 text-gray-400 focus:outline-none">
              <MessageSquare className="w-4 h-4" />
              {comments.length}
            </button>
          </div>

          {/* 우측 수정 / 삭제 버튼 */}
          {isMyPost && (
            <div className="flex gap-3">
              {/* 수정 버튼 */}
              <button
                onClick={() => navigate(`/posts/${params?.postId}/modify`)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4A77E4] text-white font-medium text-sm hover:bg-[#3d68d0] transition"
              >
                <SquarePen className="w-4 h-4" />
                수정
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#D94A3D] text-white font-medium text-sm hover:bg-[#c23c30] transition"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 간격 */}
      <div className="h-6" />

      {/* ───────────── 댓글 카드 ───────────── */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg">댓글 ({comments.length})</h2>

        {/* 댓글 입력 (NEW) */}
        {isLogin && (
          <form
            onSubmit={handleAddComment}
            className="mt-4 flex items-center gap-3"
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요."
              className={twMerge(
                "flex-1 h-10 rounded-lg px-4",
                "bg-white text-[#1A1D25] placeholder-gray-400",
                "border border-black/5 shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-transparent"
              )}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={twMerge(
                "h-10 px-7 rounded-lg font-semibold text-white",
                "bg-gradient-to-r from-violet-500 to-indigo-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <span className="text-[13px] font-thin">작성</span>
            </button>
          </form>
        )}

        {/* 댓글 리스트 */}
        {comments.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-6">
            아직 댓글이 없습니다.
          </div>
        )}
        {comments.map((c) => (
          <Comment
            key={c._id}
            _id={c._id}
            userId={c.user_id}
            author={c.profiles?.display_name || "익명"}
            level={c.profiles?.level || 0}
            badge={c.profiles?.badge || ""}
            profileImage={c.profiles?.profile_image}
            time={formaRelativeTime(c.created_at)}
            content={c.comment}
            isEdited={!!c.update_at && c.created_at !== c.update_at}
            isMine={c.user_id === userId}
            onEditSave={handleCommentEdit} // 저장 함수 연결
            onDelete={handleCommentDelete}
          />
        ))}
      </Card>
    </div>
  );
}
