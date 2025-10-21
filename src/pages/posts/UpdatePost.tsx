import { ImageUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { twMerge } from "tailwind-merge";


export default function UpdatePost() {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const [userId, setUserId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string>("");
  const [channelId, setChannelId] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 포스트 id 가져오기
  const params = useParams();

  const { channel } = params;

  // params.postId
  useEffect(() => {
    const fetchPost = async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select("_id, user_id, channel_id, title, content")
        .eq("_id", params?.postId)
        .single();

      if (error) {
        console.error("게시글 불러오기 실패:", error);
      } else {
        setChannelId(post.channel_id)
        setPostId(post._id);
        setUserId(post.user_id);
        setTitle(post.title);
        setContent(post.content);
      }
    };
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
    fetchPost();
    fetchImage();
    fetchHashtags();
    console.log("Update Post: fetchPost");
  }, [params?.postId]);

  // 이미지 업로드 핸들러
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
      if (hashtags.includes(trimmed)) return alert("이미 추가한 태그입니다.");
      if (hashtags.length >= 5)
        return alert("최대 5개까지만 추가할 수 있습니다.");

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

    // 예외처리 부분
    if (!userId || userId.trim() === "") {
      alert("유효한 사용자 ID가 필요합니다.");
      return;
    }
    if (!postId || postId.trim() === "") {
      alert("유효한 게시물 ID가 필요합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    // 포스트 수정 로직
    try {
      setIsSubmitting(true);
      // post 수정
      const { data: postData, error: postError } = await supabase
      .from("posts")
      .update(
        {
          title,
          content,
          user_id: userId,
          channel_id: channelId,
        }
      )
      .eq("_id", params?.postId)
      .select()
      .single();
      console.log("UpdatePost: handleSubmit 게시글 수정");
      if (postError) throw postError;
      if (!postData) throw new Error("게시글 수정 실패: 데이터 없음");

      // image 등록
      // 기존 이미지 목록 불러오기
      const { data: prevRows, error: prevErr } = await supabase
        .from("images")
        .select("_id, src")
        .eq("post_id", postData._id)
        .order("_id", { ascending: true }); // 순서 보장
      if (prevErr) throw prevErr;

      const prev = prevRows ?? [];
      const next = images.filter(Boolean) as string[];

      // 기존보다 이미지가 줄었으면, 초과분 삭제
      if (next.length < prev.length) {
        const toDeleteIds = prev.slice(next.length).map(r => r._id);
        if (toDeleteIds.length) {
          const { error: delErr } = await supabase
            .from("images")
            .delete()
            .in("_id", toDeleteIds);
          if (delErr) throw delErr;
        }
      }

      // 기존보다 이미지가 늘었으면, 새로 추가
      if (next.length > prev.length) {
        const toInsert = next.slice(prev.length).map(src => ({
          post_id: postData._id,
          src,
        }));
        const { error: insErr } = await supabase.from("images").insert(toInsert);
        if (insErr) throw insErr;
      }

      // 기존 개수와 같으면, 순서가 바뀌었을 수 있으므로 업데이트
      if (next.length === prev.length) {
        for (let i = 0; i < next.length; i++) {
          if (next[i] !== prev[i]?.src) {
            const { error: updErr } = await supabase
              .from("images")
              .update({ src: next[i] })
              .eq("_id", prev[i]._id);
            if (updErr) throw updErr;
          }
        }
      }

      // hashtag(해시태그) 저장 (전체 삭제 -> 재삽입)
      {
        const { error: delTagsErr } = await supabase
          .from("hashtags")
          .delete()
          .eq("post_id", postData._id);
        if (delTagsErr) throw delTagsErr;

        if (hashtags.length > 0) {
          const rows = hashtags.map((hashtag) => ({ post_id: postData._id, hashtag }));
          const { error: insTagsErr } = await supabase
          .from("hashtags")
          .insert(rows);
          if (insTagsErr) throw insTagsErr; 
        }
      }

      alert("게시글이 수정되었습니다.");
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
            placeholder="해시태그를 입력하세요."
            className="placeholder-[#ADAEBC] w-full bg-white h-[42px] rounded-[8px] pl-4"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
          />
        </div>

        <div className="flex justify-between w-full border-t border-t-[#E5E7EB] pt-6">
          <button type="button"
            className="text-white w-[150px] h-10 rounded-[8px] border border-[#303A4B] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            onClick={goBackHandler}
          >
            취소
          </button>
          <button
            className="text-white w-[150px] h-10 rounded-[8px] bo bg-gradient-to-r from-[#6366F1] via-[#7761F3] to-[#8B5CF6] shadow-[0_0_4px_#8B5CF6]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
