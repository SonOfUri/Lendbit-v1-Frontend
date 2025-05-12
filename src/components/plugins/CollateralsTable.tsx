import React from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

const CollateralsTable: React.FC = () => {
    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usdValue: "$9.1k",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usdValue: "$9.1k",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usdValue: "$21.5k",
        },
    ];

    return (
        <div className="w-full text-white bg-black rounded-md overflow-hidden noise shadow-1">
            {/* Table Header */}
            <div className="grid grid-cols-4 p-4 bg-[#181919] font-semibold text-sm text-left">
                <span>Assets</span>
                <span>Amount</span>
                <div className="col-span-2 flex justify-start gap-8 pr-2">Actions</div>
            </div>

            {/* Table Body */}
            {data.map(({ icon, symbol, amount, usdValue }) => (
                <div
                    key={symbol}
                    className="grid grid-cols-4 p-4 items-center text-sm text-left"
                >
                    {/* Token */}
                    <TokenTagSm icon={icon} symbol={symbol} />

                    {/* Amount + USD */}
                    <div className="flex flex-col">
                        <span className="font-bold">{amount}</span>
                        <span className="text-gray-400">{usdValue}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-2 flex justify-start gap-4 pr-2">
                        <CustomBtn1 label="Deposit" variant="primary" />
                        <CustomBtn1 label="Withdraw" variant="secondary" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CollateralsTable;
