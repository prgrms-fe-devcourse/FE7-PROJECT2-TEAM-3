import { Link } from "react-router";
import type { HashTags } from "../../types/post";

export default function TrendingHashTag({ hash }: { hash: HashTags }) {
  return (
    <>
      <article>
        <Link
          to={`/postSearch?hashtag=${encodeURIComponent(hash.hashtag)}`}
          className="block p-3 border border-transparent rounded-lg cursor-pointer hover:border-[#4E46A5] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(108,99,255,0.1)_100%)]"
        >
          <h4 className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-white">
            #{hash.hashtag}
          </h4>
          <p className="text-[10px] text-gray-500">{hash.count}개의 게시물</p>
        </Link>
      </article>
    </>
  );
}
