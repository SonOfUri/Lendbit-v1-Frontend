import React, { useState } from 'react';
import { TokenItem } from '../../constants/types';
import TokenSelector from './TokenSelector';
import useTokenBalances from '../../hooks/read/useTokenBalances';

interface TokenInputProps {
	label: string;
	token: TokenItem | null;
	amount: string;
	onTokenSelect: (token: TokenItem) => void;
	onAmountChange: (amount: string) => void;
	tokenList: TokenItem[];
	balance: string;
	walletAddress?: string;
	chainId?: number;
}

const TokenInput: React.FC<TokenInputProps> = ({
	label,
	token,
	amount,
	onTokenSelect,
	onAmountChange,
	tokenList,
	balance,
	walletAddress,
	chainId
}) => {
	const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
	
	const { getTokenBalance, getTokenBalanceByAddress } = useTokenBalances({
		walletAddress,
		chainId
	});

	// Get actual balance for selected token
	const actualBalance = token ? getTokenBalance(token.symbol) : '0.0';

	const handleMaxClick = () => {
		onAmountChange(actualBalance);
	};

	const handlePercentageClick = (percentage: number) => {
		const balanceAmount = parseFloat(actualBalance);
		if (!isNaN(balanceAmount) && balanceAmount > 0) {
			const percentageAmount = (balanceAmount * percentage) / 100;
			onAmountChange(percentageAmount.toFixed(6));
		}
	};

	return (
		<div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
			<div className="flex justify-between items-center mb-2">
				<span className="text-gray-400 text-sm">{label}</span>
				<span className="text-gray-400 text-sm">
					Balance: {actualBalance}
				</span>
			</div>

			<div className="flex items-center space-x-3">
				{/* Token Selector */}
				<div className="relative">
					<button
						onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
						className="flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] px-3 py-2 rounded-lg transition-colors min-w-[120px]"
					>
						{token ? (
							<>
								<img
									src={token.icon}
									alt={token.symbol}
									className="w-6 h-6 rounded-full"
								/>
								<span className="text-white font-medium">{token.symbol}</span>
							</>
						) : (
							<span className="text-gray-400">Select Token</span>
						)}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
							<path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>

					{isTokenSelectorOpen && (
						<TokenSelector
							tokens={tokenList}
							onSelect={(selectedToken) => {
								// Log all details when token is selected (especially for "From" field)
								if (label === "From") {
									console.log('=== FROM TOKEN SELECTED ===');
									console.log('Selected Token Details:', selectedToken);
									console.log('Token Symbol:', selectedToken.symbol);
									console.log('Token Icon:', selectedToken.icon);
									console.log('Token Address:', selectedToken.address);
									console.log('Available Balance:', actualBalance);
									console.log('Wallet Address:', walletAddress);
									console.log('Chain ID:', chainId);
									console.log('========================');
								}
								
								onTokenSelect(selectedToken);
								setIsTokenSelectorOpen(false);
							}}
							onClose={() => setIsTokenSelectorOpen(false)}
							chainId={chainId}
							isToField={label === "To"}
						/>
					)}
				</div>

				{/* Amount Input */}
				<div className="flex-1">
					<input
						type="number"
						value={amount}
						onChange={(e) => onAmountChange(e.target.value)}
						placeholder="0.0"
						className="w-full bg-transparent text-white text-xl font-medium outline-none placeholder-gray-500"
					/>
				</div>

				{/* Max Button */}
				{token && (
					<button
						onClick={handleMaxClick}
						className="text-[#DD4F00] hover:text-[#DD4F00] text-sm font-medium px-2 py-1 rounded transition-colors"
					>
						MAX
					</button>
				)}
			</div>

			{/* Percentage Buttons - Below the input (only for "From" input) */}
			{label === "From" && token && parseFloat(actualBalance) > 0 && (
				<div className="flex space-x-2 mt-2">
					<button
						onClick={() => handlePercentageClick(25)}
						className="text-[#DD4F00] hover:text-[#DD4F00] text-xs font-medium px-3 py-1 rounded transition-colors border border-[#DD4F00]/20 hover:border-[#DD4F00]/40"
					>
						25%
					</button>
					<button
						onClick={() => handlePercentageClick(50)}
						className="text-[#DD4F00] hover:text-[#DD4F00] text-xs font-medium px-3 py-1 rounded transition-colors border border-[#DD4F00]/20 hover:border-[#DD4F00]/40"
					>
						50%
					</button>
					<button
						onClick={() => handlePercentageClick(75)}
						className="text-[#DD4F00] hover:text-[#DD4F00] text-xs font-medium px-3 py-1 rounded transition-colors border border-[#DD4F00]/20 hover:border-[#DD4F00]/40"
					>
						75%
					</button>
					<button
						onClick={handleMaxClick}
						className="text-[#DD4F00] hover:text-[#DD4F00] text-xs font-medium px-3 py-1 rounded transition-colors border border-[#DD4F00]/20 hover:border-[#DD4F00]/40"
					>
						100%
					</button>
				</div>
			)}
		</div>
	);
};

export default TokenInput; 