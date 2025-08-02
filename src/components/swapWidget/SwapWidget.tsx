import React, { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import SwapButton from './SwapButton';
import SwapSettings from './SwapSettings';
import SwapInfo from './SwapInfo';
import { TokenItem } from '../../constants/types';
import { tokenMockedData } from '../../constants/utils/tokenMockedData';
import { getTokenLogo } from '../../constants/utils/getTokenLogo';
import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers/react';
import ConnectPrompt from '../shared/ConnectPrompt';

const SwapWidget: React.FC = () => {
	const { isConnected, address, chainId } = useWeb3ModalAccount();
	const { open } = useWeb3Modal();
	const [fromToken, setFromToken] = useState<TokenItem | null>(null);
	const [toToken, setToToken] = useState<TokenItem | null>(null);
	const [fromAmount, setFromAmount] = useState('');
	const [toAmount, setToAmount] = useState('');
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [slippage, setSlippage] = useState(0.5);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Convert token data to TokenItem format
	const tokenList: TokenItem[] = tokenMockedData.map(token => ({
		symbol: token.symbol,
		icon: getTokenLogo(token.symbol)
	}));

	const handleSwap = async () => {
		if (!fromToken || !toToken || !fromAmount || !isConnected) return;
		
		// Validate inputs
		if (parseFloat(fromAmount) <= 0) {
			setError('Please enter a valid amount');
			return;
		}
		
		if (fromToken.symbol === toToken.symbol) {
			setError('Cannot swap the same token');
			return;
		}
		
		setIsLoading(true);
		setError(null);
		
		try {
			// TODO: Replace with actual swap contract call
			// Example transaction:
			// const tx = await contract.swap(
			//   fromToken.address,
			//   toToken.address,
			//   fromAmount,
			//   slippage
			// );
			// await tx.wait();
			
			// Simulate swap transaction for now
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Reset form after successful swap
			setFromAmount('');
			setToAmount('');
			setFromToken(null);
			setToToken(null);
			
		} catch (error) {
			console.error('Swap failed:', error);
			setError('Swap failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Calculate estimated output amount based on token prices
	const calculateOutputAmount = (inputAmount: string, fromTokenSymbol: string, toTokenSymbol: string) => {
		if (!inputAmount || !fromTokenSymbol || !toTokenSymbol) return '';
		
		const fromTokenData = tokenMockedData.find(t => t.symbol === fromTokenSymbol);
		const toTokenData = tokenMockedData.find(t => t.symbol === toTokenSymbol);
		
		if (!fromTokenData || !toTokenData) return '';
		
		const inputValue = parseFloat(inputAmount) * fromTokenData.price;
		const outputAmount = inputValue / toTokenData.price;
		
		return outputAmount.toFixed(6);
	};

	// Update output amount when input changes
	useEffect(() => {
		if (fromToken && toToken && fromAmount) {
			const output = calculateOutputAmount(fromAmount, fromToken.symbol, toToken.symbol);
			setToAmount(output);
		}
	}, [fromToken, toToken, fromAmount]);

	const handleSwitchTokens = () => {
		setFromToken(toToken);
		setToToken(fromToken);
		setFromAmount(toAmount);
		setToAmount(fromAmount);
	};

	// Show connect prompt if wallet is not connected
	if (!isConnected) {
		return (
			<div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
				<ConnectPrompt />
			</div>
		);
	}

	return (
		<div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
			{/* Error Display */}
			{error && (
				<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
					<div className="flex items-center space-x-2">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-400">
							<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<span className="text-red-400 text-sm">{error}</span>
					</div>
				</div>
			)}

			{/* From Token Input */}
			<TokenInput
				label="From"
				token={fromToken}
				amount={fromAmount}
				onTokenSelect={setFromToken}
				onAmountChange={setFromAmount}
				tokenList={tokenList}
				balance="0.0"
				walletAddress={address}
				chainId={chainId}
			/>

			{/* Switch Button */}
			<div className="flex justify-center">
				<button
					onClick={handleSwitchTokens}
					className="bg-[#1A1A1A] hover:bg-[#2A2A2A] p-2 rounded-full transition-colors"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
						<path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</button>
			</div>

			{/* To Token Input */}
			<TokenInput
				label="To"
				token={toToken}
				amount={toAmount}
				onTokenSelect={setToToken}
				onAmountChange={setToAmount}
				tokenList={tokenList}
				balance="0.0"
				walletAddress={address}
				chainId={chainId}
			/>

			{/* Swap Info */}
			<SwapInfo
				fromToken={fromToken}
				toToken={toToken}
				fromAmount={fromAmount}
				toAmount={toAmount}
				slippage={slippage}
			/>

			{/* Swap Button */}
			<SwapButton
				onClick={handleSwap}
				isLoading={isLoading}
				disabled={!fromToken || !toToken || !fromAmount || isLoading}
			/>

			{/* Settings */}
			<SwapSettings
				isOpen={isSettingsOpen}
				onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
				slippage={slippage}
				onSlippageChange={setSlippage}
			/>
		</div>
	);
};

export default SwapWidget; 