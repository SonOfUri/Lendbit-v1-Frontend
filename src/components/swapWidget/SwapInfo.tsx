import React, { useState, useEffect } from 'react';
import { TokenItem } from '../../constants/types';
import { getExchangeRate, isChainSupported } from '../../services/dexscreenerService';

interface SwapInfoProps {
	fromToken: TokenItem | null;
	toToken: TokenItem | null;
	fromAmount: string;
	toAmount: string;
	slippage: number;
	chainId?: number;
	okxQuote?: any;
}

const SwapInfo: React.FC<SwapInfoProps> = ({
	fromToken,
	toToken,
	fromAmount,
	toAmount,
	slippage,
	chainId,
	okxQuote
}) => {
	const [realExchangeRate, setRealExchangeRate] = useState<string>('1.0');
	const [isLoadingRate, setIsLoadingRate] = useState(false);

	// Fetch real exchange rate from DexScreener
	useEffect(() => {
		const fetchExchangeRate = async () => {
			if (!fromToken || !toToken || !chainId || !isChainSupported(chainId) || !fromToken.address || !toToken.address) {
				setRealExchangeRate('1.0');
				return;
			}

			setIsLoadingRate(true);
			try {
				const rate = await getExchangeRate(fromToken.address, toToken.address, chainId);
				
				if (rate) {
					setRealExchangeRate(rate.toFixed(6));
				} else {
					setRealExchangeRate('1.0');
				}
			} catch (error) {
				console.error('Error fetching exchange rate:', error);
				setRealExchangeRate('1.0');
			} finally {
				setIsLoadingRate(false);
			}
		};

		fetchExchangeRate();
	}, [fromToken, toToken, chainId]);

	// Parse OKX quote data if available
	const okxExchangeRate = okxQuote?.toTokenAmount && okxQuote?.fromTokenAmount
		? (parseInt(okxQuote.toTokenAmount) / parseInt(okxQuote.fromTokenAmount)).toFixed(6)
		: null;
	
	const exchangeRate = okxExchangeRate 
		? okxExchangeRate
		: fromToken && toToken && fromAmount && toAmount
			? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)
			: realExchangeRate;
	
	// Calculate price impact from OKX quote or use simplified calculation
	const priceImpact = okxQuote?.priceImpactPercentage 
		? Math.abs(parseFloat(okxQuote.priceImpactPercentage)).toFixed(2)
		: fromToken && toToken ? '0.12' : '0.0';
	
	// Calculate minimum received based on OKX quote and slippage
	const minimumReceived = okxQuote?.toTokenAmount
		? (parseInt(okxQuote.toTokenAmount) * (1 - slippage / 100) / Math.pow(10, parseInt(okxQuote.toToken.decimal))).toFixed(6)
		: fromToken && toToken && toAmount 
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

			{okxQuote?.estimateGasFee && (
				<div className="flex justify-between items-center">
					<span className="text-gray-400 text-sm">Estimated Gas Fee</span>
					<span className="text-white text-sm">{okxQuote.estimateGasFee} wei</span>
				</div>
			)}
		</div>
	);
};

export default SwapInfo; 