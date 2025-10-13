import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

type Post = {
  _id: string;
  channel_id: string;
  content: string;
  created_at: string;
  image: string;
  title: string;
  update_at: string;
  user_id: string;
};

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase.from("posts").select("*");
        if (error) throw error;
        setPosts(posts);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPosts();
  }, []);
  return (
    <ul>
      {posts.map((post) => (
        <article key={post._id}>
          <li>{post.title}</li>
        </article>
      ))}
    </ul>
  );
}
