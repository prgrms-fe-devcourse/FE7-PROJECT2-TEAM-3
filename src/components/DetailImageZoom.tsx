import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function DetailImageZoom({ src }: { src: string | null }) {
  return (
    <div className="viewer-container w-full h-full flex items-center justify-center">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        limitToBounds={true}
        wheel={{ smoothStep: 0.002 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: false, mode: "toggle" }}
        centerOnInit={true}
        centerZoomedOut={true}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          {src && <img className="h-dvh w-auto" src={src} alt="" />}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
