import { useEffect, useState } from "react";

// 생성할 별의 총 개수
const STAR_COUNT = 300;

// 별의 종류 정의
const STAR_TYPES = {
  small: { count: Math.floor(STAR_COUNT * 0.6), size: "1px", opacity: 0.5 },
  medium: { count: Math.floor(STAR_COUNT * 0.3), size: "2px", opacity: 0.8 },
  large: { count: Math.floor(STAR_COUNT * 0.1), size: "3px", opacity: 1.0 },
};

interface Star {
  top: string;
  left: string;
  width: string;
  height: string;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
}

export default function GalaxyBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [];

    // 각 종류별로 별을 생성
    Object.values(STAR_TYPES).forEach((type) => {
      for (let i = 0; i < type.count; i++) {
        generatedStars.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: type.size,
          height: type.size,
          opacity: type.opacity * (Math.random() * 0.5 + 0.5), // 기본 투명도에 랜덤성 추가
          animationDuration: `${Math.random() * 5 + 3}s`, // 3s ~ 8s, 더 느리고 자연스럽게
          animationDelay: `${Math.random() * 5}s`,
        });
      }
    });

    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 -z-10 bg-[radial-gradient(circle_at_25%_75%,_#212C3D_0%,_#182130_100%)]">
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute bg-white rounded-full animate-twinkleBackground"
          style={star}
        ></span>
      ))}
    </div>
  );
}
