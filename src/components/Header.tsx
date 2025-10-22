import { NavLink, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import Logo from "../assets/image/logo.png";
import LogoChkn from "../assets/image/logo_chkn.png";
import {
  House,
  Mail,
  MoonStar,
  SatelliteDish,
  UserRoundSearch,
} from "lucide-react";
import { useBreakpoint } from "../hooks/useBreakPoint";
import { Activity } from "react";

export default function Header() {
  const navigate = useNavigate();
  const darkmodeHandler = () => {
    document.body.classList.toggle("light");
  };

  const { isXs, isXl } = useBreakpoint();

  return (
    <>
      <header
        className={twMerge(
          "flex flex-col justify-between w-20 xl:w-80",
          isXs && "flex-row bg-[#1a2537] w-full border-t border-[#303A4B]"
        )}
      >
        <Activity mode={!isXs ? "visible" : "hidden"}>
          <h1
            className="logo flex-center h-18 border-b border-[#303A4B] cursor-pointer"
            onClick={() => navigate("/home")}
          >
            {isXl && (
              <img className="w-auto h-15" src={Logo} alt="CHICKEN GALAXY" />
            )}
            {!isXl && (
              <img
                className="w-auto h-15"
                src={LogoChkn}
                alt="CHICKEN GALAXY"
              />
            )}
          </h1>
        </Activity>
        <nav
          className={twMerge(
            "flex flex-col flex-1 gap-4 p-3 text-[0px] xl:text-base xl:px-3 xl:py-5",
            isXs && "flex-row flex-4"
          )}
        >
          <NavLink
            to="/home"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]",
                isXs && "flex-1"
              )
            }
          >
            <House className="w-6 h-6 stroke-[#EF4444]" />홈
          </NavLink>
          <NavLink
            to="/channel/all"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]",
                isXs && "flex-1"
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
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]",
                isXs && "flex-1"
              )
            }
          >
            <UserRoundSearch className="w-6 h-6 stroke-[#F59E0B]" />
            유저 검색
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              twMerge(
                "flex justify-center items-center xl:justify-normal xl:gap-3 p-3 xl:px-4 xl:py-3 border border-transparent text-white font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.1)]",
                isActive &&
                  "border-[#44387D] bg-[rgba(123,97,255,0.1)] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] hover:bg-[#44387D]",
                isXs && "flex-1"
              )
            }
          >
            <Mail className="w-6 h-6 stroke-[#06B6D4]" />
            채팅 목록
          </NavLink>
        </nav>
        <div className={twMerge("p-4", isXs && "flex-1")}>
          {/* 라이트모드 */}
          <button
            className="button button flex justify-between items-center w-full p-3 xl:px-4 xl:py-3 bg-gradient-to-r from-[#234A45] via-[#31305D] to-[#252849] shadow-[0px_0px_20px_0px_rgba(123,97,255,0.2)] rounded-lg border border-[#44387D] cursor-pointer"
            onClick={darkmodeHandler}
          >
            <div className="flex-center w-full xl:w-auto xl:gap-3 font-bold text-white text-[0px] xl:text-xl">
              <MoonStar className="w-6 h-6 xl:w-7.5 xl:h-7.5 stroke-[#F59E0B] fill-[#F59E0B]" />
              다크모드
            </div>
            {isXl && (
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
