import { forwardRef } from "react";
import clsx from "clsx";

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary", // primary | secondary | ghost | danger | blue
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
          "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:active:scale-100",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950",
          "rounded-xl", // Modern rounded corners

          // Variants
          {
            "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-900/20":
              variant === "primary",

            "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 shadow-lg shadow-blue-900/20":
              variant === "blue", // New variant for Login page

            "bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-slate-500 border border-slate-700":
              variant === "secondary",

            "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50":
              variant === "ghost",

            "bg-red-700 hover:bg-red-600 text-white focus:ring-red-600":
              variant === "danger",
          },

          // Sizes
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-3.5 text-base": size === "lg",
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
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
      aria-hidden
    />
  );
}