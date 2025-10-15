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
    {
      id: 1,
      name: "오치추",
      position: [0.24, 10.8],
      path: "/channel/todayPick",
    },
    { id: 2, position: [26.76, 0.22] },
    { id: 3, name: "신메뉴", position: [58.25, 8.9], path: "/channel/new" },
    { id: 4, position: [70.67, 54.89] },
    {
      id: 5,
      name: "꿀조합",
      position: [99.64, 99.78],
      path: "/channel/bestCombo",
    },
    { id: 6, position: [79.77, 99.78] },
    {
      id: 7,
      name: "괴식행성",
      position: [65.26, 73.01],
      path: "/channel/weird",
    },
    { id: 8, position: [5.21, 48.1] },
  ];

  return (
    <div className="viewer-container w-[calc(100vw-640px)] h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={10}
        limitToBounds={false} // 캔버스 밖으로 드래그 가능하게 설정
        doubleClick={{ disabled: true }} // 더블클릭 줌 비활성화
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div className="relative w-full min-w-dvw h-auto">
            <ConstellationSVG className="inset-0 w-full h-full" />
            <div className="absolute inset-0">
              {stars.map((s) => (
                <div
                  key={s.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${s.position[0]}%`,
                    top: `${s.position[1]}%`,
                  }}
                >
                  <button
                    className={twMerge(
                      "rounded-full",
                      s.path
                        ? "w-20 h-20 bg-white border-2 border-amber-300 shadow-[0px_0px_20px_0px_#FFD86F] transition-all hover:shadow-[0px_0px_50px_0px_#FFD86F]"
                        : "w-1 h-1 bg-white"
                    )}
                    onClick={() => s.path && navigate(s.path)}
                  />
                  {s.path && (
                    <span className="absolute top-1/2 left-full -translate-y-1/2 flex-center whitespace-nowrap rounded-lg bg-[rgba(0,0,0,0.8)] min-w-25  ml-2.5 p-2 text-xs text-white border border-[rgba(255,216,111,0.3)]">
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
