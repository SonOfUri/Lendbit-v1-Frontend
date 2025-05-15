import React, { useState } from "react";

interface BorrowRequestProps {
	tokenSymbol: string;
	tokenIcon: string;
	maxAmount: number;
	minAmount: number;
	apr: number;
	duration: string;
	onSubmit: (amount: number) => void;
	onClose: () => void;
}

const BorrowFromLendOrder: React.FC<BorrowRequestProps> = ({
	tokenSymbol,
	tokenIcon,
	maxAmount,
	minAmount,
	apr,
	duration,
	onSubmit,
	onClose,
}) => {
	const [amount, setAmount] = useState<number>(minAmount);
	const [error, setError] = useState<string>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseFloat(e.target.value);
		setAmount(val);
		if (val < minAmount || val > maxAmount) {
			setError(
				`Amount must be between ${minAmount} and ${maxAmount} ${tokenSymbol}`
			);
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
		<div className="bg-[#050505] rounded-lg p-6 shadow-md w-full max-w-md relative">
			<button
				onClick={onClose}
				className="absolute top-4 right-4 text-gray-400 hover:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

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
					className="w-full bg-[#181818] border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DD4F00] text-white"
					placeholder={`Min: ${minAmount}, Max: ${maxAmount}`}
					min={minAmount}
					max={maxAmount}
				/>
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>

			<div className="text-sm text-white mb-3 space-y-2">
				<div className="flex justify-between">
					<span className="text-gray-400">Available:</span>
					<span>
						{maxAmount} {tokenSymbol}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-400">APR:</span>
					<span>{apr}%</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-400">Duration:</span>
					<span>{duration}</span>
				</div>
			</div>

			<button
				onClick={handleSubmit}
				className="w-full bg-[#DD4F00] hover:bg-[#C54600] text-white font-semibold py-2 px-4 rounded transition-colors"
			>
				Confirm Borrow
			</button>
		</div>
	);
};

export default BorrowFromLendOrder;
