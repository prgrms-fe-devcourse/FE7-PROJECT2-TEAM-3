import type { Database } from "./database";
import type { Profile } from "./profile";

type CommentType = Database["public"]["Tables"]["comments"]["Row"];

type CommentProfile = Pick<
  Profile,
  "display_name" | "profile_image" | "exp" | "badge" | "level"
>;

interface CommentDetailItem extends CommentType {
  profiles: CommentProfile[0];
}

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
