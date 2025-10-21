import type { Database } from "./database";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type BaseProfile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserProfile extends BaseProfile {
  _id: string;
  display_name: string;
  email: string | null;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  level: number | null;
  exp: number | null;
  badge: string | null;
  is_online: boolean | null;
}

interface ProfileUI extends Omit<UserProfile, "_id"> {
  id: string; // UI에서는 _id 대신 id 사용 (선택사항)
}

interface UserRankItem
  extends Pick<
    UserProfile,
    "_id" | "display_name" | "profile_image" | "level" | "exp" | "badge"
  > {
  rank: number;
}