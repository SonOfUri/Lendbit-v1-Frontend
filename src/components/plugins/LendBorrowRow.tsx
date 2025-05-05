import React from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

type Props = {
    icon: string;
    symbol: string;
    amount: string;
    usd: string;
    apr: string;
    poolId: string;
    statusPercent: number; // 0 - 100
    expiry: string;
    type: "lend" | "borrow";
};

const getBatterySvg = (percent: number) => {
    if (percent <= 25) return "/battery-25.svg";
    if (percent <= 50) return "/battery-50.svg";
    if (percent <= 75) return "/battery-75.svg";
    return "/battery-100.svg";
};

const LendBorrowRow: React.FC<Props> = ({
                                            icon,
                                            symbol,
                                            amount,
                                            usd,
                                            apr,
                                            poolId,
                                            statusPercent,
                                            expiry,
                                            type,
                                        }) => {
    const batteryIcon = getBatterySvg(statusPercent);

    return (
        <div className="grid grid-cols-7 gap-4 p-4 items-center text-left text-white text-sm relative group">
            {/* Assets */}
            <TokenTagSm icon={icon} symbol={symbol} />

            {/* Amount */}
            <div className="flex flex-col">
                <span className="font-bold text-sm">{amount}</span>
                <span className="text-xs text-gray-400">{usd}</span>
            </div>

            {/* APR */}
            <div className="font-semibold">{apr}</div>

            {/* Pool ID */}
            <div className="text-xs text-gray-400">{poolId}</div>

            {/* Status */}
            {type === "lend" ? (
                <div
                    className="relative flex items-center"
                >
                    <img src={batteryIcon} alt="status" className="w-10 h-10" />
                    {/* Tooltip */}
                    <span className="absolute top-full mt-1 left-0 text-[10px] bg-black text-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {statusPercent}%
          </span>
                </div>
            ) : (
                <span className="font-semibold text-sm text-white">Open</span>
            )}

            {/* Duration / Expiry */}
            <div className="font-semibold whitespace-nowrap">{expiry}</div>

            {/* Action */}
            <CustomBtn1 label={type === "lend" ? "Lend" : "Borrow"} variant="primary" />
        </div>
    );
};

export default LendBorrowRow;
