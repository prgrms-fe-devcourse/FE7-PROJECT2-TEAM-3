import { Flame, Hash, Trophy } from "lucide-react";
import { Link } from "react-router";
import Input from "./ui/Input";
import { twMerge } from "tailwind-merge";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <>
      <div className={twMerge("w-80 p-5", className)}>
        <div className="flex flex-col h-full gap-5">
          <div className="flex gap-5">
            <div className="glassmoph-bd rounded-4xl flex-1">
              <Input
                className="border-none rounded-4xl glassmoph-bg h-full "
                type="text"
                placeholder="검색어를 입력하세요..."
              />
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1744872665943-fd335d371059?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="w-13 h-13 rounded-full object-cover"
                alt="유저이름"
              />
              {/* 알림 있을 때 */}
              <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
            </div>
          </div>
          <div className="glassmoph-bd rounded-2xl">
            <div className="flex flex-col gap-6  glassmoph-bg rounded-2xl p-6.5 ">
              <div className="title flex gap-4 items-center">
                <Flame className="w-7 h-7" />
                <h2 className="text-xl font-black">인기 게시물</h2>
              </div>
              <div className="flex flex-col gap-4">
                <Link to="">바삭바삭</Link>
              </div>
            </div>
          </div>
          <div className="glassmoph-bd rounded-2xl">
            <div className="flex flex-col gap-6  glassmoph-bg rounded-2xl p-6.5 ">
              <div className="title flex gap-4 items-center">
                <Hash className="w-7 h-7" />
                <h2 className="text-xl font-black">해시태그</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to=""
                  className="px-2 py-1 rounded-sm bg-white text-gray-500 font-semibold text-sm"
                >
                  # 바삭바삭
                </Link>
                <Link
                  to=""
                  className="px-2 py-1 rounded-sm bg-white text-gray-500 font-semibold text-sm"
                >
                  # 바삭바삭바삭바
                </Link>
                <Link
                  to=""
                  className="px-2 py-1 rounded-sm bg-white text-gray-500 font-semibold text-sm"
                >
                  # 길이길기이
                </Link>
              </div>
            </div>
          </div>
          <div className="glassmoph-bd rounded-2xl">
            <div className="flex flex-col gap-6  glassmoph-bg rounded-2xl p-6.5 ">
              <div className="title flex gap-4 items-center">
                <Trophy className="w-7 h-7" />
                <h2 className="text-xl font-black">유저 랭킹</h2>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="image w-12.5 h-12.5 bg-amber-200 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1759763494786-642b023e8956?q=80&w=780&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="유저이름"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="nickname flex-1 text-sm">닉네임</div>
                  <div className="level text-xs font-bold text-gray-500">
                    Lv.3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
