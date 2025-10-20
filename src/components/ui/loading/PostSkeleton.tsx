export default function PostSkeleton({ line }: { line: number | 1 }) {
  const repeat = Array.from({ length: line }, (_, idx) => idx);

  return (
    <>
      <div className="flex flex-col animate-pulse">
        {repeat.map((_, idx) => (
          <div
            key={idx}
            className="flex w-full gap-3 p-6 mb-6 border border-[#303A4B] rounded-lg bg-[#161C27] cursor-pointer hover:bg-[#171f2b] hover:border-[#4E46A5]"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex-center">
                  <span className="w-20 h-5 rounded-sm bg-gray-200"></span>
                </div>
                <div className="flex-center gap-2">
                  <span className="w-7 h-4 rounded-sm bg-gray-200"></span>
                  <span className="w-10 h-4 rounded-sm bg-gray-200"></span>
                  <span className="w-15 h-4 rounded-sm bg-gray-200"></span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-60 h-6 rounded-sm bg-gray-200"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-3/4 h-5 rounded-sm bg-gray-200"></div>
                  <div className="w-1/2 h-5 rounded-sm bg-gray-200"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-center gap-1">
                  <span className="w-4.5 h-4.5 rounded-sm bg-gray-200"></span>
                  <span className="w-10 h-4.5 rounded-sm bg-gray-200"></span>
                </div>
                <div className="flex-center gap-1">
                  <span className="w-4.5 h-4.5 rounded-sm bg-gray-200"></span>
                  <span className="w-10 h-4.5 rounded-sm bg-gray-200"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
