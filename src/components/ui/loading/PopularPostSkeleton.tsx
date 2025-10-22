export default function PopularPostSkeleton () {
  return (
    <>
      <article className="flex gap-3 p-3 bg-[#161C27] rounded-lg cursor-pointer hover:opacity-70">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center flex-wrap gap-x-2.5">
            <p className="w-15 h-5 rounded-sm bg-gray-200"></p>
            <p className="w-10 h-5 rounded-sm bg-gray-200"></p>
          </div>
          <div className="w-full h-5 rounded-sm bg-gray-200"></div>
          <div className="flex gap-3">
            <p className="flex-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
              <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
            </p>
            <p className="flex-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
              <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
            </p>
          </div>
        </div>
      </article>
      <article className="flex gap-3 p-3 bg-[#161C27] rounded-lg cursor-pointer hover:opacity-70">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center flex-wrap gap-x-2.5">
            <p className="w-15 h-5 rounded-sm bg-gray-200"></p>
            <p className="w-10 h-5 rounded-sm bg-gray-200"></p>
          </div>
          <div className="w-full h-5 rounded-sm bg-gray-200"></div>
          <div className="flex gap-3">
            <p className="flex-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
              <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
            </p>
            <p className="flex-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-gray-200"></span>
              <span className="w-10 h-3 rounded-xs bg-gray-200"></span>
            </p>
          </div>
        </div>
      </article>
    </>
  );
}