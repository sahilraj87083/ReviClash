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
      leftIcon, // New Prop for icons (Mail, Lock, etc.)

      /* Chat mode */
      isChat = false,
      onSend,

      className = "",
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
      <div className={clsx("space-y-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 ml-1"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative group">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}

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
              "w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 transition-all",
              "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50",
              leftIcon ? "pl-10" : "", // Add padding if left icon exists
              isPassword || isChat ? "pr-12" : "",
              className
            )}

            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
                         text-blue-600 hover:text-blue-500 transition p-2"
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