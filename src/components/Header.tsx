import { NavLink, useNavigate } from "react-router";
import { House, Pin, Gamepad2, UserRoundSearch, Sun, Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Logo from "../assets/image/Logo";

export default function Header({ className }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <>
      <header className={twMerge("w-35 p-5", className)}>
        <div className="h-full glassmoph-bd rounded-2xl">
          <div className="flex flex-col h-full glassmoph-bg rounded-2xl">
            <h1
              className="logo flex-center w-25 h-25"
              onClick={() => navigate("/home")}
            >
              <Logo className="w-15 h-15" />
            </h1>
            <nav className="flex-center flex-col flex-1 gap-10">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  twMerge(
                    "flex-center relative w-full h-15",
                    isActive &&
                      "on before:content-[''] before:absolute before:right-0 before:w-1 before:h-full"
                  )
                }
              >
                <House className="w-8 h-8" />
              </NavLink>
              <NavLink
                to="/channel"
                className={({ isActive }) => (isActive ? "on" : "")}
              >
                <Pin className="w-8 h-8" />
              </NavLink>
              <NavLink
                to="/game"
                className={({ isActive }) => (isActive ? "on" : "")}
              >
                <Gamepad2 className="w-8 h-8" />
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) => (isActive ? "on" : "")}
              >
                <UserRoundSearch className="w-8 h-8" />
              </NavLink>
            </nav>
            <div className="flex-center w-25 h-25">
              {/* 라이트모드 */}
              <div className="flex justify-between items-center px-2 gap-2 relative h-10 rounded-4xl bg-white">
                <Sun className="w-6 h-6 stroke-gray-300" />
                <Moon className="w-6 h-6" />
                <button className="absolute top-1.5 right-2 w-7 h-7 rounded-full bg-gray-300 text-[0px]">
                  토글
                </button>
              </div>
              {/* 다크모드 */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
