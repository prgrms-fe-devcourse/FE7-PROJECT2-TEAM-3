import { ImageUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

// TODO: 제목 글자 제한, 내용 최소 글자 수 제한

const allowedChannels = ["weird", "todayPick", "new", "bestCombo"] as const;
export default function PostCreatePage() {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [userId, setUserId] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { channel } = useParams();

  // 잘못된 URL로 접근했을 때 막는 로직
  useEffect(() => {
    if (
      channel &&
      !allowedChannels.includes(
        channel as "weird" | "todayPick" | "new" | "bestCombo"
      )
    ) {
      alert("잘못된 채널입니다.");
      navigate("/channel/write", { replace: true });
    } else setChannelId(channel ?? null);
  }, [channel, navigate]);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        // 로그인되지 않은 사용자 예외처리 부분
        if (!user) {
          toast.success("로그인 후 이용 가능한 페이지입니다.");

          navigate("/login");
          return;
        }

        if (userError) throw userError;
        if (!user) throw new Error("로그인 된 사용자가 없습니다.");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("_id, email")
          .eq("email", user.email)
          .single();

        if (profileError) throw profileError;
        if (!profile) throw new Error("프로필 정보를 찾을 수 없습니다.");

        setUserId(profile._id);
      } catch (e) {
        console.error("사용자 정보 조회 중 오류", e);
        alert(`게시글 등록 중 오류가 발생했습니다.\n${(e as Error).message}`);
      }
    };

    fetchProfileId();
  }, [navigate]);

  // 업로드 핸들러
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setImages((prev) => {
          const copy = [...prev];
          if (ev.target?.result) {
            copy[index] = ev.target.result as string;
          }
          return copy;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  // 해시 태그 관련 함수들
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const composing =
      (e.nativeEvent as unknown as KeyboardEvent).isComposing ||
      e.key === "Process";
    if (composing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = hashtagInput.trim();
      if (!trimmed) return;
      if (hashtags.includes(trimmed))
        return toast.success("이미 추가한 태그입니다.");
      if (hashtags.length >= 5)
        return toast.success("최대 5개까지만 추가할 수 있습니다.");

      setHashtags((prev) => [...prev, trimmed]);
      setHashtagInput("");
    }
  };
  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  // 폼 제출 시 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 예외처리 부분
    if (!userId || userId.trim() === "") {
      toast.success("유효한 사용자 ID가 필요합니다.");

      return;
    }
    if (!title.trim() || !content.trim() || !channelId?.trim()) {
      toast.success("제목, 내용, 채널 아이디를 모두 입력해주세요.");
      return;
    }

    // 실제 포스트 등록 로직
    try {
      setIsSubmitting(true);
      // post 등록
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content,
            user_id: userId,
            channel_id: channelId,
          },
        ])
        .select()
        .single();
      if (postError) throw postError;

      try {
        // 현재 프로필 정보 가져오기
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("exp, level")
          .eq("_id", userId)
          .single();

        if (profileError) throw profileError;

        let newExp = (profile?.exp || 0) + 30; // 게시글 등록 시 경험치 +30
        let newLevel = profile?.level || 0;

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

        if (updateError) throw updateError;
      } catch (e) {
        console.error("경험치 업데이트 중 오류:", e);
      }

      // image 등록
      if (images.filter(Boolean).length > 0) {
        const { error: imageError } = await supabase
          .from("images")
          .insert(
            images.filter(Boolean).map((src) => ({
              post_id: postData._id,
              src,
            }))
          )
          .select();

        if (imageError) throw imageError;
      }

      // hashtag 등록
      if (hashtags.length > 0) {
        const { error: hashtagError } = await supabase
          .from("hashtags")
          .insert(
            hashtags.map((hashtag) => ({
              post_id: postData._id,
              hashtag,
            }))
          )
          .select();

        if (hashtagError) throw hashtagError;
      }

      toast.success("게시글이 등록되었습니다.");

      navigate(`/channel/${channelId}`);
    } catch (e) {
      console.log(e);
      alert("게시글 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#161C27] text-[14px] p-[30px] rounded-[16px]">
      <form onSubmit={handleSubmit}>
        {!channel && (
          <div className="mb-5">
            <label htmlFor="channel" className="text-white block  mb-2">
              채널
            </label>
            <select
              name="channel"
              id="channel"
              required
              value={channelId ?? ""}
              onChange={(e) => setChannelId(e.target.value)}
              className="bg-white w-full h-[54px] rounded-[8px] pl-4"
            >
              <option value="">채널을 선택해주세요</option>
              <option value="weird">괴식</option>
              <option value="todayPick">오치추</option>
              <option value="new">신메뉴</option>
              <option value="bestCombo">꿀조합</option>
            </select>
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="title" className="block text-white mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            placeholder="제목을 입력하세요"
            className="bg-white placeholder-[#ADAEBC] w-full h-[54px] rounded-[8px] pl-4"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="content" className="block text-white  mb-2">
            내용
          </label>
          <textarea
            name="content"
            id="content"
            placeholder="컨텐츠 내용을 작성하세요"
            required
            value={content}
            className="bg-white placeholder-[#ADAEBC] w-full h-[200px] rounded-[8px] p-4"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-5">
          <p className="text-white mb-2">이미지 첨부 (최대 4개)</p>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-center w-full h-40 border border-dashed border-[#D1D5DB] rounded-md cursor-pointer hover:border-blue-400 transition"
              >
                {img ? (
                  <>
                    <img
                      src={img}
                      alt={`uploaded ${idx + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <ImageUp size={32} className="text-gray-400" />
                    <p className="text-gray-400 text-sm mt-2">
                      Click to upload image {idx + 1}
                    </p>
                    <input
                      aria-label="이미지 업로드 영역"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleImageUpload(e, idx)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 w-full h-[110px]">
          <p className="text-white mb-[10px]">해시태그 (최대 5개)</p>
          <div
            className={twMerge(
              "mb-[10px] w-full transition-all duration-100", // 기본 스타일
              hashtags.length > 0 ? "h-[28px]" : "h-0" // 조건부 높이
            )}
          >
            {hashtags.map((tag, idx) => {
              const pastelColors = [
                "bg-[#E0F7FA] text-[#027A9B]", // 밝은 하늘 + 진한 청록
                "bg-[#D8F5E0] text-[#2E7D32]", // 밝은 민트 + 진한 초록
                "bg-[#FFE5D0] text-[#D84315]", // 밝은 피치 + 진한 오렌지
                "bg-[#FFF1F7] text-[#C2185B]", // 밝은 핑크 + 진한 체리핑크
                "bg-[#FFF9C4] text-[#B78900]", // 밝은 노랑 + 진한 골드
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
                  <button
                  aria-label="해시태그 지우기"
                    type="button"
                    onClick={() => removeHashtag(tag)}
                    className="cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}
          </div>

          <input
            type="text"
            id="hashtags"
            placeholder="태그를 입력하세요."
            className="placeholder-[#ADAEBC] w-full bg-white h-[42px] rounded-[8px] pl-4"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            aria-label="해시태그 입력칸"
          />
        </div>

        <div className="flex justify-between w-full border-t-1 border-t-[#E5E7EB] pt-6">
          <button
            aria-label="포스트 작성 취소"
            className="text-white w-[150px] h-10 rounded-[8px] border-1 border-[#303A4B] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            onClick={goBackHandler}
          >
            취소
          </button>
          <button
            aria-label="포스트 등록"
            className="text-white w-[150px] h-10 rounded-[8px] bo bg-gradient-to-r from-[#6366F1] via-[#7761F3] to-[#8B5CF6] shadow-[0_0_4px_#8B5CF6]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "작성"}
          </button>
        </div>
      </form>
    </div>
  );
}
