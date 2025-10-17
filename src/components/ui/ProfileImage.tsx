import { twMerge } from "tailwind-merge";
import NoProfileImage from "../../assets/image/no_profile_image.png";

export default function ProfileImage({
  className,
  src,
  alt,
}: {
  className: string | null;
  src: string | null;
  alt: string;
}) {
  return (
    <img
      className={twMerge("rounded-full object-cover", className)}
      src={src ? src : NoProfileImage}
      alt={alt}
    />
  );
}
