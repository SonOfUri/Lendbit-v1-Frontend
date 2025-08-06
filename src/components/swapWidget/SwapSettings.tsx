import React, { useState } from 'react';

interface SwapSettingsProps {
	isOpen: boolean;
	onToggle: () => void;
	slippage: number;
	onSlippageChange: (slippage: number) => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
	isOpen,
	onToggle,
	slippage,
	onSlippageChange
}) => {
	const [customSlippage, setCustomSlippage] = useState(slippage.toString());

	const handleSlippageChange = (value: number) => {
		onSlippageChange(value);
		setCustomSlippage(value.toString());
	};

	const handleCustomSlippageChange = (value: string) => {
		setCustomSlippage(value);
		const numValue = parseFloat(value);
		if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
			onSlippageChange(numValue);
		}
	};

	return (
		<div className="border-t border-[#1A1A1A] pt-4">
			<div className="flex justify-between items-center">
				<span className="text-gray-400 text-sm">Settings</span>
				<button
					onClick={onToggle}
					className="text-gray-400 hover:text-white transition-colors"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
					>
						<path
							d="M9 18L15 12L9 6"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div className="mt-4 space-y-4">
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-400 text-sm">Slippage Tolerance</span>
							<span className="text-white text-sm">{slippage}%</span>
						</div>
						
						<div className="flex space-x-2 mb-2">
							{['0.1', '0.5', '1.0'].map((value) => (
								<button
									key={value}
									onClick={() => handleSlippageChange(parseFloat(value))}
									className={`px-3 py-1 rounded text-sm transition-colors ${
										slippage === parseFloat(value)
											? 'bg-blue-500 text-white'
											: 'bg-[#1A1A1A] text-gray-400 hover:text-white'
									}`}
								>
									{value}%
								</button>
							))}
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="number"
								value={customSlippage}
								onChange={(e) => handleCustomSlippageChange(e.target.value)}
								placeholder="Custom"
								className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-1 text-white text-sm outline-none"
								min="0"
								max="50"
								step="0.1"
							/>
							<span className="text-gray-400 text-sm">%</span>
						</div>
					</div>

					<div className="text-xs text-gray-500">
						Your transaction will revert if the price changes unfavorably by more than this percentage.
					</div>
				</div>
			)}
		</div>
	);
};

export default SwapSettings; 