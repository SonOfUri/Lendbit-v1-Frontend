import React from "react";

type HealthBarProps = {
    percentage: number;
};

const HealthBar: React.FC<HealthBarProps> = ({ percentage }) => {
    const safe = Math.max(0, Math.min(100, percentage));

    return (
        <div className="relative h-2 w-full rounded-full overflow-hidden bg-[#191818]">
            {/* Full gradient background */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,_#ff0000,_#ffff00,_#008000)]" />

            {/* Mask covering unfilled portion */}
            <div
                className="absolute top-0 right-0 h-full bg-[#191818] transition-all duration-500"
                style={{ width: `${100 - safe}%` }}
            />
        </div>
    );
};

export default HealthBar;
