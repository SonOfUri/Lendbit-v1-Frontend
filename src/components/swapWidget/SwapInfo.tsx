import React from 'react';
import { TokenItem } from '../../constants/types';
import { tokenMockedData } from '../../constants/utils/tokenMockedData';

interface SwapInfoProps {
	fromToken: TokenItem | null;
	toToken: TokenItem | null;
	fromAmount: string;
	toAmount: string;
	slippage: number;
}

const SwapInfo: React.FC<SwapInfoProps> = ({
	fromToken,
	toToken,
	fromAmount,
	toAmount,
	slippage
}) => {
	// Calculate exchange rate based on token prices
	const fromTokenData = fromToken ? tokenMockedData.find(t => t.symbol === fromToken.symbol) : null;
	const toTokenData = toToken ? tokenMockedData.find(t => t.symbol === toToken.symbol) : null;
	
	const exchangeRate = fromTokenData && toTokenData 
		? (toTokenData.price / fromTokenData.price).toFixed(6)
		: '0.0';
	
	// Calculate price impact (simplified)
	const priceImpact = fromToken && toToken ? '0.12' : '0.0';
	const minimumReceived = fromToken && toToken && toAmount 
		? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)
		: '0.0';

	if (!fromToken || !toToken) {
		return null;
	}

	return (
		<div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4 space-y-3">
			<div className="flex justify-between items-center">
				<span className="text-gray-400 text-sm">Exchange Rate</span>
				<span className="text-white text-sm">
					1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
				</span>
			</div>

			<div className="flex justify-between items-center">
				<span className="text-gray-400 text-sm">Price Impact</span>
				<span className="text-green-400 text-sm">{priceImpact}%</span>
			</div>

			<div className="flex justify-between items-center">
				<span className="text-gray-400 text-sm">Minimum Received</span>
				<span className="text-white text-sm">
					{minimumReceived} {toToken.symbol}
				</span>
			</div>

			<div className="flex justify-between items-center">
				<span className="text-gray-400 text-sm">Slippage Tolerance</span>
				<span className="text-white text-sm">{slippage}%</span>
			</div>
		</div>
	);
};

export default SwapInfo; 