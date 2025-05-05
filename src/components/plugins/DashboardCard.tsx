import React from "react";
import HealthBar from "./HealthBar.tsx";

type DashboardCardProps = {
    title: string;
    value: string;
    buttonText: string;
    onButtonClick?: () => void;
    tooltip?: string;
    subLabel?: string; // e.g. "Assets", "Net APY", "Health Factor"
    subValue?: string; // e.g. "+0.00", "100%"
    tokenIcons?: string[];
    showHealthBar?: boolean;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
                                                         title,
                                                         value,
                                                         buttonText,
                                                         onButtonClick,
                                                         tooltip,
                                                         subLabel,
                                                         subValue,
                                                         tokenIcons,
                                                         showHealthBar = false,
                                                     }) => {
    return (
        <div className="bg-black rounded-md p-4 text-white w-full flex flex-col justify-between gap-2 min-h-[120px]">
            {/* Header: Title + Action */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-sm text-gray-400">{title}</span>
                    {/* Main Value */}
                    <div className="text-2xl font-semibold text-left">{value}</div>
                </div>

                <button
                    onClick={onButtonClick}
                    className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 self-center">
                    <img
                        src="/dashboard-btn-icon.svg"
                        alt="action"
                        width={16}
                        height={16}
                        className="rounded-full"
                    />
                    {buttonText}
                </button>
            </div>

            {/* Bottom Row: Label + Tooltip + Icons or subValue */}
            {/* Bottom Row: Label + Tooltip + Icons + subValue */}
            <div className="flex justify-between items-center mt-auto pt-2 text-sm text-gray-400">
                {/* Label + Tooltip */}
                <div className="flex items-center gap-1">
                    {subLabel && <span>{subLabel}</span>}
                    {tooltip && (
                        <img
                            src="/dashboard-tooltip-icon.svg"
                            alt="tooltip"
                            width={14}
                            height={14}
                            title={tooltip}
                        />
                    )}
                </div>

                {/* subValue (even if showHealthBar is true) */}
                {subValue && (
                    <span className="text-white text-sm font-medium">{subValue}</span>
                )}

                {/* Token Icons */}
                {tokenIcons && tokenIcons.length > 0 && (
                    <div className="flex items-center">
                        {tokenIcons.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`token-${i}`}
                                width={20}
                                height={20}
                                className={`border-0 border-white ${i !== 0 ? "-ml-2" : ""}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Health Bar underneath */}
            {showHealthBar && (
                <div className="w-full">
                    <HealthBar percentage={Number(subValue?.replace("%", "") || 100)} />
                </div>
            )}

        </div>
    );
};

export default DashboardCard;
