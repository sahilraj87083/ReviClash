import { useState, forwardRef, useId } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      value,
      name,
      id,
      onChange,
      placeholder,
      autoComplete,
      required = false,

      /* NEW */
      isChat = false,
      onSend,

      wrapperClassName = "",
      ...props
    },
    ref
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || name || generatedId;

    const handleKeyDown = (e) => {
      if (isChat && e.key === "Enter" && value?.trim()) {
        e.preventDefault();
        onSend?.();
      }
    };

    return (
      <div className={wrapperClassName}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          <input
            id={inputId}
            name={name}
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            className={clsx(
              "w-full rounded-md px-4 py-2.5",
              "bg-slate-800 border border-slate-700 text-white",
              "focus:outline-none focus:ring-2 focus:ring-red-500",
              isPassword || isChat ? "pr-12" : ""
            )}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {/* Chat Send Icon */}
          {isChat && (
            <button
              type="button"
              onClick={() => value?.trim() && onSend?.()}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-red-500 hover:text-red-400 transition"
            >
              <i className="ri-send-plane-2-fill text-lg" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default Input;
