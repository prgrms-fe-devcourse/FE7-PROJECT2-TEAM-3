import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GalaxyBackground from "./ui/background/GalaxyBackground";
import ShootingStars from "./ui/background/ShootingStars";

export default function Default() {
  return (
    <>
      <div className="flex relative w-screen h-screen overflow-hidden ">
        <Header />
        <main className="flex-1 my-5 glassmoph-bd rounded-2xl">
          <div className="h-full glassmoph-bg rounded-2xl p-10">
            <Outlet />
          </div>
        </main>
        <Sidebar />
      </div>
      {/* 배경 */}
      <ShootingStars />
      <GalaxyBackground />
    </>
  );
}
