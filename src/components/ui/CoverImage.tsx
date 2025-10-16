import { twMerge } from "tailwind-merge";
import NoCoverImage from "../../assets/image/no_cover_image.png";

export default function CoverImage({
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
      src={src !== null ? src : NoCoverImage}
      alt={alt}
    />
  );
}
