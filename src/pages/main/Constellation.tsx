import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import ConstellationSVG from "../../components/svgs/ConstellationSVG";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TodayPickImg from "../../assets/image/planet_today.png";
import NewImg from "../../assets/image/planet_new.png";
import BestImg from "../../assets/image/planet_best.png";
import WeirdImg from "../../assets/image/planet_weird.png";
import { Info } from "lucide-react";

type Star = {
  id?: string;
  name?: string;
  position: [number, number]; // [left%, top%]
  path?: string;
  src?: string;
};

export default function Constellation() {
  const navigate = useNavigate();

  const stars: Star[] = [
    {
      id: "todayPick",
      name: "오치추",
      position: [0.24, 10.8],
      path: "/channel/todayPick",
      src: TodayPickImg,
    },
    { position: [26.76, 0.22] },
    {
      id: "new",
      name: "신메뉴",
      position: [58.25, 8.9],
      path: "/channel/new",
      src: NewImg,
    },
    { position: [70.67, 54.89] },
    {
      id: "bestCombo",
      name: "꿀조합",
      position: [99.64, 99.78],
      path: "/channel/bestCombo",
      src: BestImg,
    },
    { position: [79.77, 99.78] },
    {
      id: "weird",
      name: "괴식행성",
      position: [65.26, 73.01],
      path: "/channel/weird",
      src: WeirdImg,
    },
    { position: [5.21, 48.1] },
  ];

  return (
    <div className="viewer-container w-[calc(100vw-642px)] h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        limitToBounds={false} // 캔버스 밖으로 드래그 가능하게 설정
        doubleClick={{ disabled: true }} // 더블클릭 줌 비활성화
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div className="relative w-full min-w-dvw h-auto">
            <ConstellationSVG className="inset-0 w-full h-full" />
            <div className="absolute inset-0">
              {stars.map((s, idx) => (
                <div
                  key={idx}
                  className="absolute max-w-20 max-h-20 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${s.position[0]}%`,
                    top: `${s.position[1]}%`,
                  }}
                >
                  <button
                    style={
                      s.src
                        ? {
                            backgroundImage: `url(${s.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }
                        : undefined
                    }
                    className={twMerge(
                      "rounded-full text-[0px]",
                      s.path
                        ? "w-20 h-20 border-2 border-amber-300 shadow-[0px_0px_20px_0px_#FFD86F] transition-all hover:shadow-[0px_0px_50px_0px_#FFD86F] bg-cover"
                        : "w-1 h-1 bg-white"
                    )}
                    onClick={() => s.path && navigate(s.path)}
                  >
                    {s.name} 으로 이동
                  </button>
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
      <div className="flex-center gap-2.5 absolute bottom-4 left-4 p-3 bg-[rgba(0,0,0,0.5)] border border-[rgba(229,231,235,0.2)] rounded-lg font-medium text-white text-xs">
        <Info className="w-5 h-5 stroke-white" />
        <p>화면을 드래그나 줌인, 줌아웃하여 행성을 탐색할 수 있습니다.</p>
      </div>
    </div>
  );
}
