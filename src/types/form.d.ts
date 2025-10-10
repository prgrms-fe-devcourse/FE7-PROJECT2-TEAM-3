type ReactInputType = React.InputHTMLAttributes<HTMLInputElement>["type"];

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: Exclude<ReactInputType, "radio" | "checkbox">;
  ref?: React.RefObject<HTMLInputElement | null>;
};

type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: "checkbox" | "radio";
  parentClassName?: string;
  children: React.ReactNode;
};

type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> & {
  label?: string;
  parentClassName?: string;
};
