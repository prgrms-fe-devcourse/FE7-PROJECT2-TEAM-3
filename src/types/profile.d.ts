import type { Database } from "./database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SearchProfile
  extends Pick<Profile, "display_name" | "profile_image" | "level" | "badge"> {}

interface UserRankItem
  extends Pick<
    Profile,
    "_id" | "display_name" | "profile_image" | "level" | "exp" | "badge"
  > {
  rank: number;
}
