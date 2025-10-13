import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

type PostListItem = {
  _id: string;
  title: string;
  created_at: string;
  content: string;
  user: {
    display_name: string;
    profile_image: string | null;
    exp: number;
  };
  likeCount: number;
  commentCount: number;
};

export default function PostsList() {
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select(`
            _id,
            title,
            content,
            created_at,
            user:profiles (display_name,profile_image,exp),
            likes (_id),
            comments (_id)`);

        if (error) throw error;

        const formatted: PostListItem[] = (data || []).map((post: any) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          user: post.user ?? { display_name: "", profile_image: null, exp: 0 },
          likeCount: Array.isArray(post.likes) ? post.likes.length : 0,
          commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
        }));

        setPosts(formatted);
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-list-container">
      <table className="post-table">
        <thead>
          <tr>
            <th>작성자</th>
            <th>제목</th>
            <th>EXP</th>
            <th>작성일</th>
            <th>좋아요</th>
            <th>댓글</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="user">
                <img
                  src={post.user?.profile_image || "/default.png"}
                  alt="프로필"
                />
                {post.user.display_name}
              </td>
              <td>{post.title}</td>
              <td>{post.user.exp}</td>
              <td>{new Date(post.created_at).toLocaleDateString()}</td>
              <td>❤️ {post.likeCount}</td>
              <td>💬 {post.commentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
