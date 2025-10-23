import { twMerge } from "tailwind-merge";

// 공통 카드 (shadow 제거 + 지정 배경색)
export default function Card ({
    className,
    children,
  }: React.PropsWithChildren<{ className?: string }>)  {
    return (
        <div
        className={twMerge(
            "rounded-2xl border border-white/10 bg-[#1A1D25]",
            "backdrop-blur-sm",
            className
        )}>
        {children}
        </div>
    );
}