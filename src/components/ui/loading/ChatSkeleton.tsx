export default function ChatSkeleton() {
  return (
    <article className="flex gap-3 p-6 border border-[#303A4B] rounded-lg bg-[#161C27] animate-pulse">
      <div className="w-10 h-10 shrink-0">
        <div className="w-full h-full rounded-full bg-gray-700"></div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-32 bg-gray-700 rounded"></div>{" "}
          <div className="h-5 w-16 bg-gray-700 rounded"></div>{" "}
          <div className="h-5 w-20 bg-gray-700 rounded"></div>{" "}
        </div>
        <div>
          <div className="h-5 w-11/12 bg-gray-700 rounded"></div>{" "}
        </div>
      </div>
    </article>
  );
}
