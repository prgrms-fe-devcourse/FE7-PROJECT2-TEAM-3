// src/components/userPage/UserTabSwitcher.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

interface UserTabSwitcherProps {
  activeTab: "posts" | "comments";
  setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "comments">>;
}

export default function UserTabSwitcher({
  activeTab,
  setActiveTab,
}: UserTabSwitcherProps) {
  return (
    <div className="flex border-b border-gray-700">
      <button
        onClick={() => setActiveTab("posts")}
        className={twMerge(
          "text-sm font-medium px-4 py-2 transition-colors cursor-pointer",
          activeTab === "posts"
            ? "text-white border-b-2 border-white"
            : "text-gray-500 hover:text-white"
        )}
      >
        작성글
      </button>
      <button
        onClick={() => setActiveTab("comments")}
        className={twMerge(
          "text-sm font-medium px-4 py-2 transition-colors cursor-pointer",
          activeTab === "comments"
            ? "text-white border-b-2 border-white"
            : "text-gray-500 hover:text-white"
        )}
      >
        댓글
      </button>
    </div>
  );
}
