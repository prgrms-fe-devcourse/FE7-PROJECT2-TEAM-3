import { Outlet, useNavigate } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GalaxyBackground from "./ui/background/GalaxyBackground";
import { MoveLeft } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex w-screen h-screen overflow-hidden ">
        <Header className="" />
        <main className="flex-1 relative h-full border-x border-[#303A4B]">
          {/* 배경 */}
          <GalaxyBackground />
          <div className="sticky top-0 flex items-center h-18 px-8 border-b border-[#303A4B] bg-[#1A2537]">
            <button
              className="flex-center gap-2 text-white cursor-pointer"
              onClick={goBackHandler}
            >
              <MoveLeft />
              이전 페이지로 이동
            </button>
          </div>
          <div className="h-full p-8 overflow-y-scroll">
            {/* 이걸로 감싸서 진행 */}
            {/* <div className="p-6 border border-[#303A4B] rounded-lg bg-[#161C27]"></div> */}
            <Outlet />
          </div>
        </main>
        <Sidebar className="w-80 border-l-[#303A4B]" />
      </div>
    </>
  );
}
