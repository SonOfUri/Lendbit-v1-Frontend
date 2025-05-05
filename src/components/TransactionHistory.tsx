import React from "react";
import TransactionRow from "./TransactionRow";

const TransactionHistory: React.FC = () => {
    const transactions = [
        {
            icon: "/icons/deposit.svg",
            label: "Deposited Collateral",
            subtext: "on 3 Jan 2024",
            tagIcon: "/Token-Logos/eth-base.svg",
            amount: "200000",
            usdAmount: "$199,999",
        },
        {
            icon: "/icons/supply.svg",
            label: "Supplied to Genesis Pool",
            subtext: "on 3 Jan 2024",
            tagIcon: "/Token-Logos/weth-base.svg",
            amount: "200000",
            usdAmount: "$199,999",
        },
        {
            icon: "/icons/borrow.svg",
            label: "Borrowed from Genesis Pool",
            subtext: "on 3 Jan 2024",
            tagIcon: "/Token-Logos/usdc-base.svg",
            amount: "200000",
            usdAmount: "$199,999",
        },
        {
            icon: "/icons/withdraw.svg",
            label: "Withdraw Funds",
            subtext: "on 3 Jan 2024",
            amount: "200000",
            tagIcon: "/Token-Logos/usdt-base.svg",
            usdAmount: "$199,999",
        },
    ];

    return (
        <div className="w-full bg-black text-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Transaction History</h2>
                <button className="text-[#D8EE10] font-medium text-sm flex items-center gap-1">
                    Export CSV
                    <img src="/icons/download.svg" alt="download" className="w-4 h-4" />
                </button>
            </div>

            <div className="divide-y divide-gray-800">
                {transactions.map((tx, idx) => (
                    <TransactionRow key={idx} {...tx} />
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
