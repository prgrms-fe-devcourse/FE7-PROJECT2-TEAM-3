import { useId } from "react";

export default function TextArea(props: TextareaProps) {
  const { label, id: propId, ...rest } = props;

  const autoId = useId();
  const id = propId || autoId;

  return (
    <>
      <div className="flex flex-col">
        {label && <label htmlFor={id}>{label}</label>}
        <textarea
          id={id}
          className="w-full p-6 border-[2px] border-gray-300 bg-white rounded-lg font-semibold placeholder:text-gray-500 focus:outline-0 focus:placeholder:hidden"
          {...rest}
        />
      </div>
    </>
  );
}
