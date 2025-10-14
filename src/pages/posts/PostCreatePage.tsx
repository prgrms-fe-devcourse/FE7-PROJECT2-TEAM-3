import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

// TODO: 해시태그 입력창을 만들고 최대 5개까지 엔터로 해시태그를 넣을 수 있도록 구현
// TODO: 파일과 해시태그를 어떻게 해야지 posts 테이블과 연동해서 DB에 저장할 수 있을지 알아보기

const allowedChannels = ["weird", "today_pick", "new", "best_combo"] as const;
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
        channel as "weird" | "today_pick" | "new" | "best_combo"
      )
    ) {
      alert("잘못된 채널입니다.");
      navigate("/write", { replace: true });
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
      }
    };

    fetchProfileId();
  }, [userId, navigate]);

  // TODO: 나중에는 여러 파일을 불러올거라 files[0]가 아니라 files로 불러와서 배열로서 이미지 파일을 불러와야 할듯
  // 이미지 업로드 시 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImage("");
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
      console.log(trimmed);
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

    const newPostId = crypto.randomUUID();
    console.log(newPostId);

    // 예외처리 부분
    if (!userId || userId.trim() === "") {
      alert("유효한 사용자 ID가 필요합니다.");
      return;
    }
    if (!title.trim() || !content.trim() || !channelId?.trim()) {
      alert("제목, 내용, 채널 아이디를 모두 입력해주세요.");
      return;
    }

    // 실제 포스트 등록 로직
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            _id: newPostId,
            title,
            content,
            user_id: userId,
            channel_id: channelId,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        alert("게시글이 등록되었습니다.");
      }
    } catch (e) {
      console.log(e);
    }
    // finally {
    //   navigate(`/channel/${channelId}`);
    // }
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
              <option value="today_pick">오치추</option>
              <option value="new">신메뉴</option>
              <option value="best_combo">꿀조합</option>
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
          {image && (
            <>
              <img src={image} alt="Thumbnail preview" />
              <button type="button" onClick={removeImage}>
                <X />
              </button>
            </>
          )}
          {!image && (
            <>
              {/* <label htmlFor="thumbnail" style={{ cursor: "pointer" }}> */}
              {/* <Upload /> */}
              {/* </label> */}
              {/* <p>Upload thumbnail image</p> */}
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                // required
                onChange={handleImageUpload}
              />
              <label htmlFor="thumbnail">Choose File</label>
            </>
          )}
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
