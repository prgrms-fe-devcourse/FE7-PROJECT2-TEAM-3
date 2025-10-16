import { NavLink, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import Logo from "../assets/image/logo.png";
import LogoChkn from "../assets/image/logo_chkn.png";
import {
  Gamepad2,
  House,
  MoonStar,
  SatelliteDish,
  UserRoundSearch,
} from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function Header() {
  const navigate = useNavigate();
  const darkmodeHandler = () => {
    document.body.classList.toggle("light");
  };

  const isDesktop = useMediaQuery("(min-width: 80rem)");

  return (
    <>
      <header className="flex flex-col justify-between w-20 xl:w-80">
        <h1
          className="logo flex-center h-18 border-b border-[#303A4B] cursor-pointer"
          onClick={() => navigate("/home")}
        >
          {isDesktop && (
            <img className="w-auto h-15" src={Logo} alt="CHICKEN GALAXY" />
          )}
          {!isDesktop && (
            <img className="w-auto h-15" src={LogoChkn} alt="CHICKEN GALAXY" />
          )}
        </h1>
        <nav className="flex flex-col flex-1 gap-4 p-3 text-[0px] xl:text-base xl:px-3 xl:py-5">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]"
              )
            }
          >
            <House className="w-6 h-6 stroke-[#06B6D4]" />홈
          </NavLink>
          <NavLink
            to="/channel/all"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]"
              )
            }
          >
            <SatelliteDish className="w-6 h-6 stroke-[#8B5CF6]" />
            채널
          </NavLink>
          <NavLink
            to="/userSearch"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]"
              )
            }
          >
            <UserRoundSearch className="w-6 h-6 stroke-[#F59E0B]" />
            유저 검색
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]"
              )
            }
          >
            <Gamepad2 className="w-6 h-6 stroke-[#EF4444]" />
            미니 게임
          </NavLink>
        </nav>
        <div className="p-4">
          {/* 라이트모드 */}
          <button
            className="button button flex justify-between items-center w-full p-3 xl:px-4 xl:py-3 bg-gradient-to-r from-[#234A45] via-[#31305D] to-[#252849] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] rounded-lg border border-[#44387D] cursor-pointer"
            onClick={darkmodeHandler}
          >
            <div className="flex-center xl:gap-3 font-bold text-white text-[0px] xl:text-xl">
              <MoonStar className="w-6 h-6 xl:w-7.5 xl:h-7.5 stroke-[#F59E0B] fill-[#F59E0B]" />
              다크모드
            </div>
            {isDesktop && (
              <div className="relative w-10 h-5 bg-[#8B5CF6] rounded-4xl">
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white text-[0px]">
                  스위치
                </span>
              </div>
            )}
          </button>
          {/* 다크모드 */}
        </div>
      </header>
    </>
  );
}
