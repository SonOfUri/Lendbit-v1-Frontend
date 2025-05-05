import React from "react";

type TransactionRowProps = {
    icon: string;
    label: string;
    subtext?: string;
    tagIcon?: string;
    amount: string;
    usdAmount?: string;
};

const TransactionRow: React.FC<TransactionRowProps> = ({
                                                           icon,
                                                           label,
                                                           subtext,
                                                           tagIcon,
                                                           amount,
                                                           usdAmount,
                                                       }) => {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-800">
            {/* Left Section */}
            <div className="flex items-start gap-3">
                <img src={icon} alt="tx-icon" className="w-5 h-5 mt-1" />

                <div>
                    <div className="flex items-center gap-1 text-white font-semibold text-sm">
                        {label}
                        {tagIcon && <img src={tagIcon} alt="tag" className="w-4 h-4" />}
                    </div>
                    {subtext && <div className="text-xs text-gray-400 text-left">{subtext}</div>}
                </div>
            </div>

            {/* Right Section */}
            <div className="text-right">
                <div className="text-white font-semibold text-sm">{amount}</div>
                {usdAmount && <div className="text-xs text-gray-400">{usdAmount}</div>}
            </div>
        </div>
    );
};

export default TransactionRow;
