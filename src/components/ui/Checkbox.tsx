import { useId } from "react";

export default function Checkbox(props: CheckboxProps) {
  const {
    parentClassName,
    children,
    type = "checkbox",
    id: propId,
    ...rest
  } = props;

  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className={parentClassName}>
      <input type={type} id={id} {...rest} />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
