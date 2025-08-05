import React, { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import SwapButton from './SwapButton';
import SwapSettings from './SwapSettings';
import SwapInfo from './SwapInfo';
import OkxPoweredBy from './OkxPoweredBy';
import { TokenItem } from '../../constants/types';
import { useWeb3ModalAccount, useSwitchNetwork } from '@web3modal/ethers/react';
import ConnectPrompt from '../shared/ConnectPrompt';
import MainnetSwitchPrompt from './MainnetSwitchPrompt';
import { isTestnetChain, getMainnetChainId, getChainName } from '../../constants/utils/chainMapping';
import useTokenBalances from '../../hooks/read/useTokenBalances';
import { getExchangeRate, isChainSupported } from '../../services/dexscreenerService';
import { useOkxDexSwap } from '../../hooks/useOkxDexSwap';

const SwapWidget: React.FC = () => {
	const { isConnected, address, chainId } = useWeb3ModalAccount();
	const { switchNetwork } = useSwitchNetwork();
	const { balances } = useTokenBalances({ walletAddress: address, chainId });
	const [fromToken, setFromToken] = useState<TokenItem | null>(null);
	const [toToken, setToToken] = useState<TokenItem | null>(null);
	const [fromAmount, setFromAmount] = useState('');
	const [toAmount, setToAmount] = useState('');
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [slippage, setSlippage] = useState(0.5);
	const [showMainnetPrompt, setShowMainnetPrompt] = useState(false);
	
	// OKX DEX Swap hook
	const {
		isLoading,
		error,
		quote,
		getSwapQuote,
		performSwap,
		clearSwapState,
		isChainSupported: isOkxChainSupported
	} = useOkxDexSwap();

	// Convert real token balances to TokenItem format for dropdown
	const tokenList: TokenItem[] = balances.map((token: any) => ({
		symbol: token.symbol,
		icon: token.image || '/Token-Logos/default-base.svg', // Use DexScreener image or default
		address: token.address // Include address for real price fetching
	}));

	const handleSwap = async () => {
		if (!fromToken || !toToken || !fromAmount || !isConnected) return;
		
		// Check if user is on testnet
		if (chainId && isTestnetChain(chainId)) {
			setShowMainnetPrompt(true);
			return;
		}
		
		// Check if chain is supported by OKX DEX
		if (chainId && !isOkxChainSupported) {
			console.error('Chain not supported by OKX DEX');
			return;
		}
		
		// Validate inputs
		if (parseFloat(fromAmount) <= 0) {
			console.error('Please enter a valid amount');
			return;
		}
		
		if (fromToken.symbol === toToken.symbol) {
			console.error('Cannot swap the same token');
			return;
		}
		
		try {
			console.log('=== SWAP DEBUG ===');
			console.log('fromAmount:', fromAmount);
			console.log('fromToken:', fromToken);
			console.log('balances:', balances);
			
			// Get token decimals from balances
			const fromTokenBalance = balances.find(b => b.address === fromToken.address);
			console.log('fromTokenBalance:', fromTokenBalance);
			const tokenDecimals = fromTokenBalance?.decimals || 18; // Default to 18 if not found
			console.log('tokenDecimals:', tokenDecimals);
			
			// Convert amount to smallest unit using correct token decimals
			const amountInWei = (parseFloat(fromAmount) * Math.pow(10, tokenDecimals)).toString();
			console.log('amountInWei:', amountInWei);
			console.log('==================');
			
			// Prepare swap parameters - use OKX DEX format for token addresses
			const swapParams = {
				fromTokenAddress: fromToken.address === '0x0000000000000000000000000000000000000000' 
					? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // OKX DEX ETH address
					: fromToken.address === '0x4200000000000000000000000000000000000006' // WETH address
					? '0x4200000000000000000000000000000000000006' // Keep WETH as WETH
					: fromToken.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
				toTokenAddress: toToken.address === '0x0000000000000000000000000000000000000000'
					? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // OKX DEX ETH address
					: toToken.address === '0x4200000000000000000000000000000000000006' // WETH address
					? '0x4200000000000000000000000000000000000006' // Keep WETH as WETH
					: toToken.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
				amount: amountInWei,
				slippage: (slippage / 100).toString() // Convert percentage to decimal
			};
			
			// Execute swap using OKX DEX
			const swapReceipt = await performSwap(swapParams);
			
			console.log('Swap completed successfully:', swapReceipt);
			
			// Reset form after successful swap
			setFromAmount('');
			setToAmount('');
			setFromToken(null);
			setToToken(null);
			clearSwapState();
			
		} catch (error) {
			console.error('Swap failed:', error);
		}
	};

	const handleSwitchToMainnet = () => {
		if (chainId) {
			const mainnetChainId = parseInt(getMainnetChainId(chainId));
			switchNetwork(mainnetChainId);
			setShowMainnetPrompt(false);
		}
	};

	const handleCancelMainnetSwitch = () => {
		setShowMainnetPrompt(false);
	};

	// Calculate estimated output amount based on token prices
	const calculateOutputAmount = async (inputAmount: string, fromToken: TokenItem | null, toToken: TokenItem | null) => {
		if (!inputAmount || !fromToken || !toToken) return '';
		
		const inputValue = parseFloat(inputAmount);
		
		// Try to get real exchange rate from DexScreener
		if (chainId && isChainSupported(chainId) && fromToken.address && toToken.address) {
			try {
				const rate = await getExchangeRate(fromToken.address, toToken.address, chainId);
				
				if (rate) {
					const outputAmount = inputValue * rate;
					return outputAmount.toFixed(6);
				}
			} catch (error) {
				console.error('Error fetching exchange rate:', error);
			}
		}
		
		// Fallback to 1:1 ratio if no real data available
		return inputValue.toFixed(6);
	};

	// Update output amount when input changes
	useEffect(() => {
		const updateOutputAmount = async () => {
			if (fromToken && toToken && fromAmount) {
				const output = await calculateOutputAmount(fromAmount, fromToken, toToken);
				setToAmount(output);
				
				// Get OKX quote if chain is supported
				if (chainId && isOkxChainSupported && fromToken.address && toToken.address) {
					try {
						// Get token decimals from balances
						const fromTokenBalance = balances.find(b => b.address === fromToken.address);
						const tokenDecimals = fromTokenBalance?.decimals || 18; // Default to 18 if not found
						
						const amountInWei = (parseFloat(fromAmount) * Math.pow(10, tokenDecimals)).toString();
						
						const quoteParams = {
							fromTokenAddress: fromToken.address === '0x0000000000000000000000000000000000000000' 
								? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // OKX DEX ETH address
								: fromToken.address === '0x4200000000000000000000000000000000000006' // WETH address
								? '0x4200000000000000000000000000000000000006' // Keep WETH as WETH
								: fromToken.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
							toTokenAddress: toToken.address === '0x0000000000000000000000000000000000000000'
								? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // OKX DEX ETH address
								: toToken.address === '0x4200000000000000000000000000000000000006' // WETH address
								? '0x4200000000000000000000000000000000000006' // Keep WETH as WETH
								: toToken.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
							amount: amountInWei,
							slippage: (slippage / 100).toString()
						};
						
						const okxQuote = await getSwapQuote(quoteParams);
						
						// Update output amount based on OKX quote
						if (okxQuote?.toTokenAmount && okxQuote?.toToken?.decimal) {
							const outputAmount = parseInt(okxQuote.toTokenAmount) / Math.pow(10, parseInt(okxQuote.toToken.decimal));
							setToAmount(outputAmount.toFixed(6));
						}
					} catch (error) {
						console.error('Failed to get OKX quote:', error);
					}
				}
			}
		};
		
		updateOutputAmount();
	}, [fromToken, toToken, fromAmount, chainId, isOkxChainSupported, slippage]);

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

	// Show mainnet switch prompt if on testnet
	if (showMainnetPrompt) {
		return (
			<div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
				<MainnetSwitchPrompt
					onSwitchToMainnet={handleSwitchToMainnet}
					onCancel={handleCancelMainnetSwitch}
					currentChainId={chainId || 0}
				/>
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
				chainId={chainId}
				okxQuote={quote}
			/>

			{/* Swap Button */}
			<SwapButton
				onClick={handleSwap}
				isLoading={isLoading}
				disabled={!fromToken || !toToken || !fromAmount || isLoading}
				isTestnet={chainId ? isTestnetChain(chainId) : false}
				chainName={chainId ? getChainName(parseInt(getMainnetChainId(chainId))) : undefined}
			/>

			{/* Settings */}
			<SwapSettings
				isOpen={isSettingsOpen}
				onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
				slippage={slippage}
				onSlippageChange={setSlippage}
			/>

			{/* Powered by OKX */}
			<OkxPoweredBy />
		</div>
	);
};

export default SwapWidget; 