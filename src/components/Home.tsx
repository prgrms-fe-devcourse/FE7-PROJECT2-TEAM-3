import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import ShootingStars from "./ui/background/ShootingStars";
import Header from "./Header";
import GalaxyBackground from "./ui/background/GalaxyBackground";

export default function Home() {
  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden ">
        <Header className="fixed top-0 bottom-0 left-0 z-50" />
        <main className="h-full">
          <Outlet />
        </main>
        <Sidebar className="fixed top-0 right-0 bottom-0 " />
        {/* 배경 */}
        <ShootingStars />
        <GalaxyBackground />
      </div>
    </>
  );
}
