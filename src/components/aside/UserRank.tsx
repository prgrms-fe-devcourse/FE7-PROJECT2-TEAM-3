import { twMerge } from "tailwind-merge";
import type { Profile } from "../../types/profile";
import ProfileImage from "../ui/ProfileImage";
import { Link } from "react-router";

export default function UserRank({
  user,
  index,
}: {
  user: Profile;
  index: number;
}) {
  return (
    <article>
      <Link
        to="/mypage"
        className="flex-center gap-2 p-3 border border-transparent rounded-lg hover:border-[#85523E] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(242,145,61,0.1)_100%)]"
      >
        <div className="relative">
          <ProfileImage
            className="w-10 h-10"
            src={user.profile_image}
            alt={user.display_name}
          />
          <span
            className={twMerge(
              "absolute top-0 right-0 flex-center w-3 h-3  rounded-full font-medium text-[0.5rem] text-white",
              index > 0 ? "bg-gray-400" : "bg-[#F2913D]"
            )}
          >
            {index + 1}
          </span>
        </div>
        <div className="flex-1 flex flex-col">
          <h4 className="overflow-hidden text-sm text-ellipsis whitespace-nowrap font-semibold text-white">
            {user.display_name}
          </h4>
          <p
            className={twMerge(
              "text-xs",
              index === 0 ? "text-[#E9AF74]" : "text-gray-500"
            )}
          >
            {user.exp} exp
          </p>
        </div>
      </Link>
    </article>
  );
}
