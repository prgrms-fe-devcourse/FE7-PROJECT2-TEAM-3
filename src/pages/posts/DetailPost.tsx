import React, {useState, useEffect, type FormEvent} from "react";
import { twMerge } from "tailwind-merge";
import {  MessageSquare, Heart, SquarePen, Trash2 } from "lucide-react";
import Comment, {Badge} from "./Comment";
import { useParams } from "react-router";
// const hashtags = ["해", "시", "태", "그", "!"];
import supabase from "../../utils/supabase";
import defaultProfile from "../../assets/image/no_profile_image.png";
import { useNavigate } from "react-router";


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

export default function PostDetail() {
    const navigate = useNavigate();
    const goBackHandler = () => {
      navigate(-1);
    };

    // 사용자 & 로그인
    const [userId, setUserId] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState<boolean>(false);

    // 글쓴이 영역
    const [writerId, setWriterId] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [nickname, setNickname] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [badge, setBadge] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<string>("");
    const [updateAt, setUpdateAt] = useState("");

    // 본문 영역
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
    const [hashtags, setHashtags] = useState<string[]>([])
 
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [userComment, setUserComment] = useState<string>('');

    type CommentType = {
      created_at: string;
      user_id: string;
      post_id: string;
      comment: string;
      update_at: string | null;
    };
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const params = useParams();
    
    // 필요없는 부분이라 판단되면 나중에 코드 일부 쳐내기
    useEffect(() => {
      const fetchProfileId = async () => {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
  
          // 로그인되지 않은 사용자 예외처리 부분
          if (!user) {
            setIsLogin(false);
          }
  
          if (userError) throw userError;
  
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("_id, email")
            .eq("email", user?.email)
            .single();
  
          if (profileError) throw profileError;
          if (!profile) throw new Error("프로필 정보를 찾을 수 없습니다.");
  
          setUserId(profile._id);
          setIsLogin(true);
        } catch (e) {
          console.error("사용자 정보 조회 중 오류", e);
          alert(`게시글 로드 중 오류가 발생했습니다.\n${(e as Error).message}`);
        }
      };
      fetchProfileId();
    }, [userId, navigate]);

    // 포스트 가져오기
    useEffect(() => {
      const fetchPost = async () => {
        const { data: post, error } = await supabase
          .from("posts")
          .select("_id, user_id, title, content, created_at, update_at")
          .eq("_id", params?.postId)
          .single();
  
        if (error) {
          console.error("게시글 불러오기 실패:", error);
        } else {
          setTitle(post.title);
          setContent(post.content);
          setCreatedAt(post.created_at);
          setUpdateAt(post.update_at);
          setWriterId(post.user_id);
        }
      };
      fetchPost();
    }, [params?.postId]);

    // 글쓴이 프로필 가져오기
    useEffect(() => {
      if (!writerId) return; // writerId가 있을 때만 실행
      const fetchProfile = async () => {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("_id, display_name, profile_image, is_online, level, badge")
          .eq("_id", writerId)
          .single();
  
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
      fetchImage();
    }, [images]);

    // 해시태그 가져오기
    useEffect(() => {
      const fetchHashtags = async () => {
        const { data: hashtag, error } = await supabase
        .from("hashtags")
        .select("hashtag")
        .eq("post_id", params?.postId)

        if (error) {
          console.error("해시태그 불러오기 실패:", error);
        } else {
          setHashtags(hashtag.map((h) => h.hashtag));
        }     
      }
      fetchHashtags();
    }, [params?.postId]);

  // 하트 가져오기
  useEffect(() => {
    const fetchLikes = async () => {
      const { data: like, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("post_id", params?.postId)

      if (error) {
        console.error("좋아요 불러오기 실패:", error);
      } else {
        setLikeCount(like.length);
      }     
    }
    fetchLikes();
  }, [params?.postId]);


  // 댓글 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      const { data: commentsObj, error } = await supabase
      .from("comments")
      .select("created_at, user_id, post_id, comment, update_at")
      .eq("post_id", params?.postId)
      .order("created_at", { ascending: true });

      if (error) {
        console.error("댓글 불러오기 실패:", error);
      } else {
        setCommentsCount(commentsObj.length);
        // console.log(commentsObj);
        // 데이터 구조 고민 중
        setComments(commentsObj);
        console.log("커멘츠", commentsObj);
      }     
    }
    fetchComments();
  }, [params?.postId]);

  // 좋아요 데이터 삭제 실패 (원인 분석 중)
  const toggleLike = async () => {
    if (!userId) {
      alert("로그인 후 이용해주세요.");
      return;
    }
  
    setAnimating(true);
  
    try {
      // 현재 좋아요 여부 확인
      const { data: existing, error: checkError } = await supabase
        .from('likes')
        .select('user_id, post_id')
        .eq('user_id', userId)
        .eq('post_id', params?.postId)
        .maybeSingle();
  
      if (checkError) throw checkError;
      console.log("exist", existing);
      if (existing) {
        // 이미 좋아요한 경우 → 삭제
        const { data: del, error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', params?.postId)
          .eq('user_id', userId);
        console.log("_id", existing._id);
        if (deleteError) throw deleteError;
        setLiked(false);
        setLikeCount((prev) => (prev-1));
      } else {
        // 좋아요 안 한 경우 → 등록
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ user_id: userId, post_id: params?.postId }]);
        if (insertError) throw insertError;  
        setLiked(true);
        setLikeCount((prev) => (prev+1));

      }
    } catch (e) {
      console.error('좋아요 처리 중 오류:', e);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };
  
    
    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          //setIsSubmitting(true);
          // 댓글 등록
          const { data: commentData, error: commentError } = await supabase
            .from("comments")
            .insert([
              {
                user_id: userId,
                post_id: params?.postId,
                comment: userComment
              },
            ])
            .select()
            .single();
          if (commentError) throw commentError;
        } catch(e) {
          console.log(e);
          alert("댓글 등록 중 오류가 발생했습니다.");
        } finally {
          setUserComment('');
          //setIsSubmitting(false);
        }
    }

    const handleDelete = async () => {
      const { data: post, error } = await supabase
      .from('posts')
      .delete() // 삭제
      .eq("_id", params?.postId);
      goBackHandler();
    }

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      {/* ───────────── 본문 카드 ───────────── */}
      <Card className="p-6">
        {/* 작성자 프로필 */}
        <div className="flex items-center gap-4">
            <img src={profileImage || defaultProfile} alt="프로필 이미지" className="w-16 h-16 rounded-full object-cover shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-extrabold leading-none">{nickname}</h3>
              <span className="text-sm font-bold text-amber-400">{`Lv ${level || "0"}`}</span>
              <Badge>{badge || "정보 없음"}</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-400">{createdAt.slice(0, 10)}</p>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="mt-6 text-xl font-semibold leading-snug">
          {title}
        </h1>

        {/* 본문 */}
        <div className="mt-4 space-y-4 text-sm text-gray-300 leading-relaxed">
          {content}
        </div>
        
        {/* 이미지 */}
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {images.map((img, idx) => (
              img && (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center justify-center w-full h-40 border border-[#D1D5DB] rounded-md cursor-pointer hover:border-blue-400 transition"
                  >
                    <img
                      src={img}
                      alt={`uploaded ${idx + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
              )
            ))}
          </div>
        </div>

        {/* 태그 */}
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
                  {tag}
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
                <MessageSquare className="w-4 h-4" />{commentsCount}
            </button>
            </div>

            {/* 우측 수정 / 삭제 버튼 */}
            <div className="flex gap-3">
                {/* 수정 버튼 */}
                <button onClick={() => navigate(`/posts/${params?.postId}/modify`)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4A77E4] text-white font-medium text-sm hover:bg-[#3d68d0] transition"
                >
                    <SquarePen className="w-4 h-4" />
                    수정
                </button>

                {/* 삭제 버튼 */}
                <button onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#D94A3D] text-white font-medium text-sm hover:bg-[#c23c30] transition"
                >
                    <Trash2 className="w-4 h-4" />
                    삭제
                </button>
            </div>
        </div>


      </Card>

      {/* 간격 */}
      <div className="h-6" />

      {/* ───────────── 댓글 카드 ───────────── */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg">댓글 ({commentsCount})</h2>

        {/* 댓글 입력 (NEW) */}
        { isLogin &&
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-3">
            <input
                type="text"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
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
                disabled={!userComment.trim()}
                className={twMerge(
                "h-10 px-7 rounded-lg font-semibold text-white",
                "bg-gradient-to-r from-violet-500 to-indigo-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                <span className="text-[13px] font-thin">작성</span>
            </button>
        </form>
        }
        {/* 댓글 리스트 */}
        <div className="mt-4">
          {comments.map((c, idx) => {
            return (<Comment
            key={idx}
            author="닉네임"
            level="Lv.5"
            role="초급자"
            time={c.created_at.slice(0, 10)}
            content={c.comment}
          />)
          })}
        </div>
      </Card>
    </div>
  );
}
