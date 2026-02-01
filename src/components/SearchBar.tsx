import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  className = "",
}) => {
  return (
      <div className={`flex shadow-xl/10 items-center w-100 bg-white  border-2 border-secondary rounded-xl px-2.5 py-1.5 mb-4  ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012.5 19.5a7.5 7.5 0 004.15-2.85z"
          />
        </svg>

        <input
          aria-label="Pesquisar"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 ml-3 bg-transparent outline-none text-sm text-secondary "
        />

        {value ? (
          <button
            onClick={() => onChange("")}
            aria-label="Limpar pesquisa"
            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        ) : null}
      </div>
  );
};

export default SearchBar;
