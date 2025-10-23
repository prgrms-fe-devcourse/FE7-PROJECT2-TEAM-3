import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import toast, { type Toast } from "react-hot-toast";

interface CustomToastProps {
  type: "success" | "error" | "info";
  message: string;
  t: Toast;
}

const iconMap = {
  success: <CheckCircle size={20} className="text-green-400" />,
  error: <XCircle size={20} className="text-red-400" />,
  info: <Info size={20} className="text-blue-400" />,
};

export default function CustomToast({ type, message, t }: CustomToastProps) {
  // 💡 t.visible을 사용하여 애니메이션 관리
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-[#1A2537] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-[#303A4B]`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">{iconMap[type]}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            <p className="mt-1 text-sm text-gray-400">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-[#303A4B]">
        <button
          onClick={() => toast.dismiss(t.id)} // 닫기 버튼 클릭 시 토스트 닫기
          className="w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
