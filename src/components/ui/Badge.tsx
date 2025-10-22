import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type BadgeProps = {
  className?: string;
  level: number | null;
};

const ALL_BADGES = [
  "치킨 미개봉자",
  "닭다리 초보자",
  "치밥 수련생",
  "소스 수집가",
  "닭껍질 연구원",
  "치킨 영웅",
  "치느님 추종자",
  "전설의 뼈 분리자",
  "갤럭시 맛 평가단장",
  "치킨 현자",
  "치느님 그 자체",
];

const BADGE_COLORS = [
  "bg-gray-500/60 text-gray-100",
  "bg-blue-500/60 text-blue-100",
  "bg-green-500/60 text-green-100",
  "bg-yellow-500/60 text-yellow-100",
  "bg-orange-500/60 text-orange-100",
  "bg-red-500/60 text-red-100",
  "bg-purple-500/60 text-purple-100",
  "bg-pink-500/60 text-pink-100",
  "bg-teal-500/60 text-teal-100",
  "bg-indigo-500/60 text-indigo-100",
  "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold",
];

export default function Badge({ className, level }: BadgeProps) {
  const [badgeName, SetBadgeName] = useState("");
  const [colorClasses, SetColorClasses] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const validLevel = Math.max(0, Math.min(level!, ALL_BADGES.length - 1));
      SetBadgeName(ALL_BADGES[validLevel]);
      SetColorClasses(BADGE_COLORS[validLevel] || BADGE_COLORS[0]);
    };
    fetchUser();
  }, [level]);

  return (
    <div
      className={twMerge(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colorClasses,
        className
      )}
    >
      {badgeName}
    </div>
  );
}
