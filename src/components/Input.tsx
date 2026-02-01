import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}

      <input
        {...props}
        className={`
          border-2 border-secondary
          shadow-sm
          rounded-xl
          px-3 py-2
          focus:outline-none focus:ring-1 focus:ring-secondary
          ${error ? "border-red-500" : ""}
          ${className}
        `}
      />

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};
