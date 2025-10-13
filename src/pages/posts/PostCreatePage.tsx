import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router";
// import { useNavigate } from "react-router-dom";

export default function PostCreatePage() {
  // const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);

  const { channel } = useParams();

  useEffect(() => {
    setChannelId(channel ?? null);
  }, [channel]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("✅ 로그인 상태:", session.user);
      } else {
        console.log("❌ 로그인되어 있지 않습니다.");
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

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
        console.log(userId);
      } catch (e) {
        console.error("사용자 정보 조회 중 오류", e);
      }
    };

    fetchProfileId();
  }, [userId]);

  // 이미지 업로드 시 함수
  // TODO: 나중에는 여러 파일을 불러올거라 files[0]가 아니라 files로 불러와서 배열로서 이미지 파일을 불러와야 할듯
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

    // 실제 포스트 등록 로직
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, user_id: userId, channel_id: channelId }])
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
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="channel">Channel</label>
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
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail Image</label>
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
              <Upload />
              {/* </label> */}
              <p>Upload thumbnail image</p>
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
          <button>글 올리기</button>
        </div>
      </form>
    </>
  );
}
