import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GalaxyBackground from "./ui/background/GalaxyBackground";

export default function Home() {
  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row w-screen h-screen overflow-hidden ">
        <Header />
        <main className="flex-1 relative h-full border-l lg:border-x border-[#303A4B]">
          {/* 배경 */}
          <GalaxyBackground />
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </>
  );
}
