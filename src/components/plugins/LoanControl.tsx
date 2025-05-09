import React, { useState } from "react";

type LoanControlProps = {
    amount: number;
    type: "APY" | "APR";
    tokenSymbol: string;
};

const LoanControl: React.FC<LoanControlProps> = ({ amount, type, tokenSymbol }) => {
    const [rate, setRate] = useState(0); // stored as hundredths of a percent (e.g. 325 = 3.25%)
    const [inputValue, setInputValue] = useState("0.00");

    const updateRate = (newRate: number) => {
        const clamped = Math.min(Math.max(newRate, 0), 10000);
        setRate(clamped);
        setInputValue((clamped / 100).toFixed(2));
    };

    const incrementRate = () => updateRate(rate + 1);
    const decrementRate = () => updateRate(rate - 1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d{0,3}(\.\d{0,2})?$/;

        if (regex.test(value)) {
            setInputValue(value);

            const numeric = parseFloat(value);
            if (!isNaN(numeric)) {
                updateRate(Math.round(numeric * 100));
            }
        }
    };

    const decimalRate = rate / 10000;
    const displayValue =
        type === "APY"
            ? `+$${(amount * decimalRate).toFixed(0)}`
            : `–$${(amount * decimalRate).toFixed(0)}`;
    const label = type === "APY" ? "Net Profit" : "Net Cost";

    return (
        <div className="bg-[#191818] text-white p-4 rounded-md w-full max-w-sm">
            <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                <span>Order Value • {label}</span>
                <span className="flex justify-between gap-1"> {tokenSymbol}  <img src="/arrows.svg" alt="Arrows" width={8} height={8} /></span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
                <div className="text-3xl font-semibold">${amount.toLocaleString()}</div>
                <div className={`text-sm ${type === "APY" ? "text-green-400" : "text-red-400"}`}>
                    {displayValue}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={decrementRate}
                    className="rounded-full bg-white text-black font-bold text-lg w-15 h-15"
                >
                    –
                </button>

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="px-6 py-2 h-15 rounded-md bg-orange-600 text-white text-xl font-semibold text-center w-[100px]"
                />

                <button
                    onClick={incrementRate}
                    className="rounded-full bg-white text-black font-bold text-lg w-15 h-15"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default LoanControl;
