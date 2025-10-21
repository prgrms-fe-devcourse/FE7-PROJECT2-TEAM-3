export default function UserSearchSkeleton({ line }: { line: number | 1 }) {
  const repeat = Array.from({ length: line }, (_, idx) => idx);

  return (
    <>
      <div className="flex flex-col gap-4 animate-pulse">
        {repeat.map((_, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] cursor-pointer hover:bg-[#171f2b] hover:border-[#4E46A5]"
          >
            <div className="w-15 h-15 bg-gray-200 rounded-full"></div>
            <div className="flex flex-col flex-1 gap-5">
              <div className="flex justify-between">
                <div className="flex-center gap-3">
                  <span className="w-25 h-6.5 rounded-sm bg-gray-200"></span>
                  <span className="w-7 h-5 rounded-sm bg-gray-200"></span>
                  <span className="w-10 h-5 rounded-sm bg-gray-200"></span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-3/4 h-5 rounded-sm bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
