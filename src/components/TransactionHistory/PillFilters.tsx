import React from "react";

interface PillFiltersProps {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    className?: string;
}

const PillFilters: React.FC<PillFiltersProps> = ({ options, selected, onSelect, className = "" }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`px-4 py-1 text-sm rounded-full border transition-colors duration-200
                        ${
                            selected === option
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-white border-gray-600 hover:border-white"
                        }
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default PillFilters;
