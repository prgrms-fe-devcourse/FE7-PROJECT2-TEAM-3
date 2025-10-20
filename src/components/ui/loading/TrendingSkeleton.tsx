export default function TrendingSkeleton() {
  return (
    <>
      <article className="flex flex-col gap-1 p-3 border border-transparent rounded-lg cursor-pointer">
        <div className="w-30 h-5 bg-gray-200 rounded-sm"></div>
        <div className="w-20 h-4 bg-gray-200 rounded-sm"></div>
      </article>
      <article className="flex flex-col gap-1 p-3 border border-transparent rounded-lg cursor-pointer">
        <div className="w-30 h-5 bg-gray-200 rounded-sm"></div>
        <div className="w-20 h-4 bg-gray-200 rounded-sm"></div>
      </article>
      <article className="flex flex-col gap-1 p-3 border border-transparent rounded-lg cursor-pointer">
        <div className="w-30 h-5 bg-gray-200 rounded-sm"></div>
        <div className="w-20 h-4 bg-gray-200 rounded-sm"></div>
      </article>
    </>
  );
}
