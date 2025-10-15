import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

// TODO: 제목 글자 제한, 내용 최소 글자 수 제한

const allowedChannels = ["weird", "todayPick", "new", "bestCombo"] as const;
export default function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");

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
          alert("로그인 후 이용 가능한 페이지입니다.");
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
  }, [userId, navigate]);

  // 이미지 업로드 시 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray: string[] = [];

      if (image.length + files.length > 4) {
        alert("이미지는 최대 4개까지만 업로드 가능합니다.");
        return;
      }

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            fileArray.push(ev.target.result as string);

            if (fileArray.length === files.length) {
              setImage((prev) => [...prev, ...fileArray]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImage((prev) => prev.filter((_, i) => index !== i));
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
    if (!title.trim() || !content.trim() || !channelId?.trim()) {
      alert("제목, 내용, 채널 아이디를 모두 입력해주세요.");
      return;
    }

    console.log(channelId);

    // 실제 포스트 등록 로직
    try {
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

      // image 등록
      if (image.length > 0) {
        const { data: imageData, error: imageError } = await supabase
          .from("images")
          .insert(
            image.map((src) => ({
              post_id: postData._id,
              src,
            }))
          )
          .select();

        if (imageError) throw imageError;
        console.log(imageData);
      }

      // hashtag 등록
      if (hashtags.length > 0) {
        const { data: hashtagData, error: hashtagError } = await supabase
          .from("hashtags")
          .insert(
            hashtags.map((hashtag) => ({
              post_id: postData._id,
              hashtag,
            }))
          )
          .select();

        if (hashtagError) throw hashtagError;
        console.log(hashtagData);
      }

      alert("게시글이 등록되었습니다.");
      navigate(`/channel/${channelId}`);
    } catch (e) {
      console.log(e);
      alert("게시글 등록 중 오류가 발생했습니다.");
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {!channel && (
          <div>
            <label htmlFor="channel">카테고리</label>
            <select
              name="channel"
              id="channel"
              required
              value={channelId ?? ""}
              onChange={(e) => setChannelId(e.target.value)}
            >
              <option value="">채널을 선택해주세요</option>
              <option value="weird">괴식</option>
              <option value="todayPick">오치추</option>
              <option value="new">신메뉴</option>
              <option value="bestCombo">꿀조합</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="content">내용</label>
          <textarea
            name="content"
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <p>이미지 첨부 (최대 4개)</p>
          {/* {image.length > 0 && <></>}
          {image.length === 0 && (
            
          )} */}
          <>
            <p>Upload thumbnail image</p>
            {image.map((imgSrc, index) => (
              <div key={imgSrc}>
                <img
                  src={imgSrc}
                  alt={`Thumbnail preview ${index + 1}`}
                  className="w-40 h-40"
                />
                <button type="button" onClick={() => removeImage(index)}>
                  <X />
                </button>
              </div>
            ))}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              multiple
              // required
              onChange={handleImageUpload}
            />
            <label htmlFor="thumbnail" style={{ cursor: "pointer" }}>
              <Upload />
            </label>
            {/* <label htmlFor="thumbnail">Choose File</label> */}
          </>
        </div>
        <div>
          <p>해시태그 (최대 5개)</p>
          <div>
            {hashtags.map((tag, idx) => (
              <span key={idx}>
                #{tag}{" "}
                <button type="button" onClick={() => removeHashtag(tag)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            id="hashtags"
            placeholder="태그를 입력하고 Enter를 누르세요."
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
          />
        </div>
        <div>
          <button>글 올리기</button>
        </div>
      </form>
    </>
  );
}
