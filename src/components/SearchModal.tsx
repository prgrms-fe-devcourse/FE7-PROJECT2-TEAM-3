// components/SearchModal.tsx
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";

type SearchModalProps = {
  onClose: () => void;
};

export default function SearchModal({ onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    inputRef.current?.focus();

    const stored = window.localStorage.getItem("search");
    if (stored) {
      setRecentQueries(JSON.parse(stored));
    } else {
      setRecentQueries([]); // 저장된 게 없으면 빈 배열
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const JSONQueries = JSON.stringify([query, ...recentQueries]);

    setRecentQueries((prev) => [query, ...prev]);

    window.localStorage.setItem("search", JSONQueries);

    navigate(`/postSearch?content=${encodeURIComponent(query)}`);
    onClose();
  };

  const searchRecentQuery = (query: string) => {
    navigate(`/postSearch?content=${encodeURIComponent(query)}`);
    onClose();
  };

  const deleteRecentQuery = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setRecentQueries((prev) => {
      const updated = prev.filter((_, index) => index !== idx);
      window.localStorage.setItem("search", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="">
      <form className="" onSubmit={handleSubmit}>
        <label className="flex items-center gap-3 px-5 py-4 border-b border-b-[#303A4B] focus:within:bg-[#161C27]">
          <Search className="w-5 h-5 stroke-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              console.log(query);
            }}
            placeholder="채널의 게시물을 검색하세요."
            className="flex-1 bg-transparent outline-none text-gray-100 placeholder:text-gray-400"
          />
        </label>
      </form>
      <div className="">
        <h3 className="p-5 font-bold text-white">최근 검색어</h3>
        {recentQueries.length > 0 && (
          <ul>
            {recentQueries.map((recent, idx) => (
              <li key={idx} className="relative">
                <p
                  className="pl-5 pr-10 py-4 border-t border-t-[#303A4B] text-xs text-gray-400 whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer"
                  onClick={() => searchRecentQuery(recent)}
                >
                  {recent}
                </p>
                <button
                  onClick={(e) => deleteRecentQuery(e, idx)}
                  className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
