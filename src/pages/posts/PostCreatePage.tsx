import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
// import { useNavigate } from "react-router-dom";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // supabase에서 프로필 id 불러오기
  // TODO: .eq 부분 현재 임의로 test ID로 설정한 부분 수정하기
  useEffect(() => {
    const fetchProfileId = async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("_id, email")
        .eq("email", "gamer_pro@example.com".trim().toLowerCase())
        .single();

      if (error) {
        console.error("프로필 불러오기 실패:", error);
      } else {
        setUserId(profile?._id);
      }
    };

    fetchProfileId();
  }, []);

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

  // 폼 제출 시 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 예외처리 부분
    if (!userId || userId.trim() === "") {
      alert("유효한 사용자 ID가 필요합니다.");
      return;
    }
    if (!title.trim() || !image.trim() || !content.trim()) {
      alert("제목, 내용, 이미지 모두 입력해주세요.");
      return;
    }

    // 실제 포스트 등록 로직
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, image, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        alert("게시글이 등록되었습니다.");
      }
    } catch (e) {
      console.log(e);
    }
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
                required
                onChange={handleImageUpload}
              />
              <label htmlFor="thumbnail">Choose File</label>
            </>
          )}
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
          <button>글 올리기</button>
        </div>
      </form>
    </>
  );
}
