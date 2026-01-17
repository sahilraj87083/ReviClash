import { forwardRef, useId } from "react";
import clsx from "clsx";

const Select = forwardRef(
  (
    {
      label,
      value = "",
      onChange,
      options = [],
      name,
      id,
      placeholder = "Select an option",
      required = false,
      wrapperClassName = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;

    return (
      <div className={wrapperClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {label}
          </label>
        )}

        <select
          id={inputId}
          name={name}
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          className={clsx(
            "w-full rounded-md px-4 py-2.5",
            "bg-slate-900/70 border border-slate-700",
            "text-slate-100",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500",
            "transition",
            value === "" && "text-slate-400"
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-slate-900"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default Select;
