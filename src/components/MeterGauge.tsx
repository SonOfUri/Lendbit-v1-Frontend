import React from "react";

type MeterGaugeProps = {
    percentage: number;
};

const MeterGauge: React.FC<MeterGaugeProps> = ({ percentage }) => {
    const safe = Math.max(0, Math.min(100, percentage));
    const isSafe = safe > 30;

    const filledColor = isSafe ? "#00aa00" : "#ff0000";
    const label = isSafe ? "SAFE" : "RISK";
    const labelColor = isSafe
        ? "text-green-700 bg-green-100 border-green-500"
        : "text-red-700 bg-red-100 border-red-500";

    const radius = 80;
    const circumference = Math.PI * radius; // Semi-circle length
    const dashOffset = circumference * (1 - safe / 100);

    return (
        <div className="w-92 h-48 flex flex-col items-center justify-end relative">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background track */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    stroke="#191818"
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Filled arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    stroke={filledColor}
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
            </svg>

            {/* Label */}
            <div
                className={`absolute top-[75%] text-sm font-bold px-4 py-1 rounded-full border ${labelColor}`}
            >
                {label}
            </div>
        </div>
    );
};

export default MeterGauge;
