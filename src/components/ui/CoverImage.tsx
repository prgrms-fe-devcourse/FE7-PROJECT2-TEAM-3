import { twMerge } from "tailwind-merge";

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
          src={
            "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740"
          }
          alt={alt}
        />
      )}
    </>
  );
}
