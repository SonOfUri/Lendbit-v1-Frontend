import React, { useState } from "react";

interface BorrowRequestProps {
    tokenSymbol: string;
    tokenIcon: string;
    maxAmount: number;
    minAmount: number;
    apr: number;
    duration: string; // e.g. "30 days"
    onSubmit: (amount: number) => void;
}

const BorrowFromLendOrder: React.FC<BorrowRequestProps> = ({
                                                               tokenSymbol,
                                                               tokenIcon,
                                                               maxAmount,
                                                               minAmount,
                                                               apr,
                                                               duration,
                                                               onSubmit,
                                                           }) => {
    const [amount, setAmount] = useState<number>(minAmount);
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setAmount(val);
        if (val < minAmount || val > maxAmount) {
            setError(`Amount must be between ${minAmount} and ${maxAmount} ${tokenSymbol}`);
        } else {
            setError("");
        }
    };

    const handleSubmit = () => {
        if (amount >= minAmount && amount <= maxAmount) {
            onSubmit(amount);
        } else {
            setError("Please enter a valid amount within the allowed range.");
        }
    };

    return (
        <div className="bg-[#050505] rounded-lg p-6 shadow-md w-full max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <img src={tokenIcon} alt={tokenSymbol} className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Borrow {tokenSymbol}</h2>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                    Amount ({tokenSymbol})
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Min: ${minAmount}, Max: ${maxAmount}`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="text-sm text-white mb-3">
                <p><strong>APR:</strong> {apr}%</p>
                <p><strong>Duration:</strong> {duration}</p>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-[#DD4F00] hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
                Confirm Borrow
            </button>
        </div>
    );
};

export default BorrowFromLendOrder;
