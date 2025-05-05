import React from "react";

type PercentageTagProps = {
    percentage: number;
};

const PercentageTag: React.FC<PercentageTagProps> = ({ percentage }) => {
    const safe = Math.max(0, Math.min(100, percentage));
    const isPositive = safe > 30;

    const labelColor = isPositive
        ? "text-green-700 bg-green-100 border-green-500"
        : "text-red-700 bg-red-100 border-red-500";

    const arrow = isPositive ? "↑" : "↓";

    return (
        <div
            className={`inline w-[50%] text-center items-center px-3 py-1 rounded-full border text-sm font-semibold ${labelColor}`}
        >
            {arrow} {safe}%
        </div>
    );
};

export default PercentageTag;
