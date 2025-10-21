// import type { Database } from "./database";

interface UserCommentItem {
  _id: string;
  comment: string;
  created_at: string;
  post: {
    _id: string;
    title: string;
  };
}

// type CommentListItem = Database["public"]["Tables"]["comments"]["Row"];

interface CommentListItem {
  comment: string;
  created_at: string;
  post_id: string;
  postTitle: {
    title: string;
  }[0];
}

interface FormattedComments {
  comment: string;
  created_at: string;
  post_id: string;
  title: string;
}
