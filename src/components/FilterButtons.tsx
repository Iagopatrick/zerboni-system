import React from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  active?: string | null;
  onChange: (value: string | null) => void;
};

export const FilterButtons: React.FC<Props> = ({
  options,
  active = null,
  onChange,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded ${active === null ? "bg-blue-600 text-white" : "bg-gray-100"}`}
      >
        Todos
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded ${active === opt.value ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
