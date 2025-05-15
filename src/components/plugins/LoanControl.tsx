import React, { useState, useEffect } from "react";
import { formatMoney2 } from "../../constants/utils/formatMoney";

type LoanControlProps = {
  amount: number;
  type: "APY" | "APR";
  tokenSymbol: string;
  rate: number; // stored as hundredths of a percent (e.g. 500 = 5.00%)
  onRateChange: (rate: number) => void;
};

const LoanControl: React.FC<LoanControlProps> = ({ 
  amount, 
  type, 
  tokenSymbol,
  rate,
  onRateChange 
}) => {
  const [inputValue, setInputValue] = useState("0.00");

  // Sync input with rate prop
  useEffect(() => {
    setInputValue((rate / 100).toFixed(2));
  }, [rate]);

  const updateRate = (newRate: number) => {
    const clamped = Math.min(Math.max(newRate, 0), 10000); // Limit between 0% and 100%
    onRateChange(clamped);
  };

  // Increment by 0.01% (1 basis point)
  const incrementRate = () => updateRate(rate + 1);
  
  // Decrement by 0.01% (1 basis point)
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

  const decimalRate = rate / 10000; // Convert to decimal (e.g. 500 => 0.05)
  const displayValue =
    type === "APY"
      ? `+$${formatMoney2(amount * decimalRate)}`
      : `–$${formatMoney2(amount * decimalRate)}`;
  const label = type === "APY" ? "Net Profit" : "Net Cost";

  return (
    <div className="bg-[#191818] text-white p-4 rounded-md w-full max-w-sm">
      <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
        <span>Order Value • {label}</span>
        <span className="flex justify-between gap-1">
          {tokenSymbol}  
          <img src="/arrows.svg" alt="Arrows" width={8} height={8} />
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <div className="text-3xl font-semibold">${formatMoney2(amount)}</div>
        <div className={`text-sm ${type === "APY" ? "text-green-400" : "text-red-400"}`}>
          {displayValue}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={decrementRate}
          className="rounded-full bg-white text-black font-bold text-lg w-8 h-8 flex items-center justify-center"
          aria-label="Decrease rate by 0.01%"
        >
          –
        </button>

        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="px-6 py-2 h-10 rounded-md bg-orange-600 text-white text-xl font-semibold text-center w-[100px]"
            aria-label={`${type} rate`}
          />
          <span className="absolute right-2 top-2 text-white text-sm">%</span>
        </div>

        <button
          onClick={incrementRate}
          className="rounded-full bg-white text-black font-bold text-lg w-8 h-8 flex items-center justify-center"
          aria-label="Increase rate by 0.01%"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default LoanControl;