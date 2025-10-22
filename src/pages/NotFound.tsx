import { Link } from "react-router";
import NotFounded from "../assets/image/notfound.png";

export default function NotFound() {
  return (
    <>
      <div className="flex-center flex-col gap-4">
        <div className="flex-center w-120 animate-flyingAstronut">
          <img src={NotFounded} alt="길잃은 여행자" />
        </div>
        <div className="flex flex-col gap-10 px-20 py-10 text-center border border-[#303A4B] rounded-lg bg-[#161C27]">
          <div className="flex flex-col gap-4">
            <strong className="text-3xl text-white font-black">
              길을 잃으셨군요!
            </strong>
            <p className="text-md text-gray-400 font-medium">
              이 페이지는 현재 치킨 은하 지도상에 존재하지 않습니다.
              <br />
              맛있는 치킨이 있는 안전한 구역으로 워프하세요!
            </p>
          </div>
          <Link
            to="/home"
            className="flex-center m-auto text-white px-6 py-4 rounded-[8px] bo bg-gradient-to-r from-[#6366F1] via-[#7761F3] to-[#8B5CF6] shadow-[0_0_4px_#8B5CF6] hover:opacity-70"
          >
            안전 구역으로 워프
          </Link>
        </div>
      </div>
    </>
  );
}
