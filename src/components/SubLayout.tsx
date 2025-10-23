import { Outlet, useNavigate } from "react-router";
import { MoveLeft } from "lucide-react";

export default function SubLayout() {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="sticky top-0 flex items-center h-16 sm:h-18 px-8 border-b border-[#303A4B] bg-[#1A2537]">
        <button
          className="flex-center gap-2 text-white cursor-pointer"
          onClick={goBackHandler}
        >
          <MoveLeft />
          이전 페이지로 이동
        </button>
      </div>
      <div className="h-full max-h-[calc(100dvh-138px)] sm:max-h-[calc(100dvh-72px)] p-8 overflow-y-scroll scrollbar-hide">
        <Outlet />
      </div>
    </>
  );
}
