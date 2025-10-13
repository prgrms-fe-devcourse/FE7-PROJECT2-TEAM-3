import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from 'react-router';
// import { useNavigate } from "react-router-dom";

export default function DetailPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [isModify, setIsModify] = useState(false);
  const [modifyTitle, setModifyTitle] = useState('');
  const [modifyText, setModifyText] = useState('');
  // 포스트 id 가져오기
  const params = useParams();
  // params.postId
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

  return (
    <>
      <h3>detailed Post</h3>
      <p>{`${params.postId}`}</p>
      <div>
        {!isModify && (
          <div>{content}</div>
        )}
        { isModify && (
          <textarea
            name="content"
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}>
          </textarea>        
        )}
        </div>
    </>
  );
}
