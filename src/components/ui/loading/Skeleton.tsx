import { twMerge } from "tailwind-merge";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "bg-gray-200 rounded-md animate-pulse",
        className
      )}
    />
  );
}
