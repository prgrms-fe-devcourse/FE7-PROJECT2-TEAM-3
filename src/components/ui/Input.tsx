import { twMerge } from "tailwind-merge";

export default function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <>
      <input
        className={twMerge(
          "w-full px-6 h-13 border-[2px] border-gray-400 bg-white rounded-lg font-semibold placeholder:text-gray-500 focus:outline-0 focus:placeholder:hidden",
          className
        )}
        {...rest}
      />
    </>
  );
}
