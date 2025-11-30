import React from "react";
import { cn } from "@/lib/utils";

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

// Renaming visually to "CleanButton" but keeping export name to avoid breaking imports in other files
export const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow transition-all duration-200 rounded-full",
      secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 rounded-full",
      outline: "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 rounded-full",
      ghost: "bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs font-medium",
      md: "h-10 px-6 text-sm font-medium",
      lg: "h-12 px-8 text-base font-medium",
      icon: "h-10 w-10 p-0 flex items-center justify-center rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
BrutalButton.displayName = "BrutalButton"; // Kept for compatibility

export const BrutalBadge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "yellow" | "outline" }) => {
    const variants = {
        default: "bg-neutral-100 text-neutral-600",
        yellow: "bg-blue-50 text-blue-700", // Changed yellow to blue/subtle
        outline: "border border-neutral-200 text-neutral-500"
    };
    return (
        <span className={cn("px-2.5 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wider", variants[variant], className)}>
            {children}
        </span>
    )
}
