import React, { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[]; // lista de opções
}

export const Select = ({ label, error, options, className = "", ...props }: SelectProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}

      <select
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
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};
