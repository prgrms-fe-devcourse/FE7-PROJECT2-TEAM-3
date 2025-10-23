import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ImageModal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 z-10 w-full h-full flex-center bg-[rgba(0,0,0,0.3)] backdrop-blur-lg">
      <button
        aria-label="모달 닫기"
        className="fixed right-10 top-10 z-50 p-2 flex-center bg-[rgba(0,0,0,0.8)] rounded-full hover:opacity-50 cursor-pointer"
        onClick={onClose}
      >
        <X className="stroke-white w-8 h-8 stroke-1" />
      </button>
      <div className="w-dvw h-dvh">{children}</div>
    </div>,
    document.body
  );
}
