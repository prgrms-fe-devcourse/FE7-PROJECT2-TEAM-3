import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from 'react-router';
// import { useNavigate } from "react-router-dom";

export default function DetailPost() {
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string | null>(null);
  const [postId, setPostId] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [isModify, setIsModify] = useState(false);
  // const [modifyTitle, setModifyTitle] = useState('');
  // const [modifyText, setModifyText] = useState('');

  // 포스트 id 가져오기
  const params = useParams();
  // params.postId
  useEffect(() => {
    const fetchPost = async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select("_id, user_id, channer_id, title, content")
        .eq("_id", params.postId)
        .single();

      if (error) {
        console.error("게시글 불러오기 실패:", error);
      } else {
        setPostId(post._id);
        setUserId(post.user_id);
        setTitle(post.title);
        setContent(post.content);
      }
    };
    const fetchImage = async () => {
      const { data: images, error } = await supabase
      .from("images")
      .select("src")
      .eq("post_id", params.postId)
      .single();

      if (error) {
        console.error("이미지 불러오기 실패:", error);
      } else {
        setImages(images.src);
      }
    }
    const fetchHashtags = async () => {
      const { data: hashtag, error } = await supabase
      .from("hashtags")
      .select("hashtag")
      .eq("post_id", params.postId)
      .single();

      if (error) {
        console.error("해시태그 불러오기 실패:", error);
      } else {
        setHashtags(hashtag.hashtag);
      }     
    }
    fetchPost();
    fetchImage();
    fetchHashtags();
  }, []);

  // 이미지 업로드 시 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImages("");
  };

  // 해시태그 업데이트


  // 폼 제출 시 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 예외처리 부분
    if (!userId || userId.trim() === "") {
      alert("유효한 사용자 ID가 필요합니다.");
      return;
    }
    if (!postId || postId.trim() === "") {
      alert("유효한 게시물물 ID가 필요합니다.");
      return;
    }
    if (!title.trim() || !images?.trim() || !content.trim()) {
      alert("제목, 내용, 이미지 모두 입력해주세요.");
      return;
    }

    // 포스트 수정 로직
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ title, content, images, update_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        alert("게시글이 수정되었습니다.");
      }
    } catch (e) {
      console.log(e);
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
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">내용용</label>
          <textarea
            name="content"
            id="content"
            required
            value={content}
            placeholder="컨텐츠 내용을 작성하세요"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="thumbnail">이력서 첨부 (최대 4개)</label>
          {images && (
            <>
              <img src={images} alt="Thumbnail preview" />
              <button type="button" onClick={removeImage}>
                <X />
              </button>
            </>
          )}
          {!images && (
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
        <label htmlFor="hashtag">이력서 첨부 (최대 4개)</label>
        <input type="text"
            id="hashtag"
            value={hashtags}
            placeholder="태그를 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setHashtags(e.currentTarget.name)
              }
            }
            
            } />
        </div>
        <div>
          <button>수정</button>
        </div>

      </form>
      <div>
        <button>취소</button>
      </div>
    </>
  );
}
