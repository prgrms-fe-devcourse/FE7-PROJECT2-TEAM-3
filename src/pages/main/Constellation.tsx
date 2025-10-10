import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import ConstellationSVG from "../../components/svgs/ConstellationSVG";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Star = {
  id: number;
  name?: string;
  position: [number, number]; // [left%, top%]
  path?: string;
};

export default function Constellation() {
  const navigate = useNavigate();

  const stars: Star[] = [
    { id: 1, name: "오치추", position: [0.28, 10.83], path: "/channel" },
    { id: 2, position: [26.77, 0.26] },
    { id: 3, name: "미니게임", position: [58.24, 8.93], path: "/channel" },
    { id: 4, position: [70.65, 54.93] },
    { id: 5, name: "베스트 치킨상", position: [99.6, 99.82], path: "/channel" },
    { id: 6, position: [79.74, 99.82] },
    { id: 7, name: "괴식행성", position: [65.26, 73.02], path: "/channel" },
    { id: 8, position: [5.24, 48.15] },
  ];

  return (
    <div className="viewer-container h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={10}
        limitToBounds={false} // 캔버스 밖으로 드래그 가능하게 설정
        doubleClick={{ disabled: true }} // 더블클릭 줌 비활성화
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <div className="relative constellation-wrapper w-full">
            <ConstellationSVG className="w-auto h-full" />
            <div className="stars">
              {stars.map((s) => (
                <div
                  key={s.id}
                  className={twMerge(
                    "absolute rounded-full -translate-x-1/2 -translate-y-1/2",
                    s.path &&
                      "flex items-center justify-center w-20 h-20 border-2 border-[rgba(255,255,255,0.3)] cursor-pointer group"
                  )}
                  style={{
                    left: `${s.position[0]}%`,
                    top: `${s.position[1]}%`,
                  }}
                >
                  <button
                    className={twMerge(
                      "rounded-full transition-all duration-300",
                      s.path
                        ? "w-4 h-4 bg-white animate-pulse group-hover:w-10 group-hover:h-10"
                        : "w-1 h-1 bg-white animate-twinkle"
                    )}
                    onClick={() => s.path && navigate(s.path)}
                    // style={{ boxShadow: "0 0 10px 4px rgba(255,255,255,.6)" }}
                    aria-label={s.name || "star"}
                  />
                  {s.path && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#816cbe] px-2 py-1 text-xs text-white shadow">
                      {s.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
