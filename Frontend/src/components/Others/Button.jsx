import { forwardRef } from "react";
import clsx from "clsx";

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary", // primary | secondary | ghost | danger
      size = "md",         // sm | md | lg
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",

          // Variants
          {
            "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500":
              variant === "primary",

            "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500":
              variant === "secondary",

            "bg-transparent text-slate-300 hover:text-white":
              variant === "ghost",

            "bg-red-700 hover:bg-red-600 text-white focus:ring-red-600":
              variant === "danger",
          },

          // Sizes
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },

          // Disabled
          {
            "opacity-60 cursor-not-allowed": disabled || loading,
          },

          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

export default Button;

/* ---------------- Spinner ---------------- */
function Spinner() {
  return (
    <span
      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
      aria-hidden
    />
  );
}
