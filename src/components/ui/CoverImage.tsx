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
    <>
      {src && (
        <img
          className={twMerge("object-cover", className)}
          src={src}
          alt={alt}
        />
      )}
      {!src && (
        <img
          className={twMerge("object-cover", className)}
          src={NoCoverImage}
          alt={alt}
        />
      )}
    </>
  );
}
