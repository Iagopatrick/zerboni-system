// components/Button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  color = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonProps) => {

  const colorClasses = {
    primary: "bg-secondary text-white hover:opacity-70",
    secondary: "",
    danger: "",
    success: "",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg
        cursor-pointer
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-xl
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
