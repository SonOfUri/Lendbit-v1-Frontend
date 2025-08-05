import { useState, useEffect } from 'react';
import { getWalletBalances } from '../../services/alchemyService';
import { getMainnetChainId } from '../../constants/utils/chainMapping';
import { getTokenPrice, isChainSupported } from '../../services/dexscreenerService';

interface TokenBalance {
	symbol: string;
	balance: string;
	decimals: number;
	address: string;
	name: string;
	image?: string | null; // Add image field for DexScreener images
	price?: number; // Add price field for ETH and other tokens
}

interface UseTokenBalancesProps {
	walletAddress?: string;
	chainId?: number;
}

const useTokenBalances = ({ walletAddress, chainId }: UseTokenBalancesProps) => {
	const [balances, setBalances] = useState<TokenBalance[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBalances = async () => {
			if (!walletAddress || !chainId) {
				setBalances([]);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				// Get mainnet chain ID for Alchemy (since Alchemy only supports mainnet)
				const mainnetChainId = parseInt(getMainnetChainId(chainId));
				
				// Fetch balances using Alchemy
				const walletBalances = await getWalletBalances(walletAddress, mainnetChainId);
				
				if (walletBalances) {
					const formattedBalances: TokenBalance[] = [];
					
					// Add ETH balance (only if > 0) - Handle ETH specially
					if (walletBalances.eth > 0) {
						// Get ETH price using WETH contract
						let ethPrice = null;
						
						if (isChainSupported(mainnetChainId)) {
							try {
								// Use WETH contract for ETH price
								const wethAddress = '0x4200000000000000000000000000000000000006'; // WETH contract
								ethPrice = await getTokenPrice(wethAddress, mainnetChainId);
							} catch (err) {
								console.warn('Failed to fetch ETH price:', err);
							}
						}
						
						// Use official Ethereum logo as primary image
						const ethImage = '/Token-Logos/eth.png';
						
						// Only include ETH if it has price data and complete info
						if (ethPrice && ethPrice > 0) {
							formattedBalances.push({
								symbol: 'ETH',
								balance: walletBalances.eth.toFixed(6),
								decimals: 18,
								address: '0x0000000000000000000000000000000000000000', // ETH doesn't have a contract
								name: 'Ethereum',
								image: ethImage,
								price: ethPrice
							});
						}
					}
					
					// Add token balances (only if > 0 and has price data)
					for (const token of walletBalances.tokens) {
						if (token.balance > 0) {
							// Try to get token price from DexScreener
							let tokenPrice = null;
							
							if (isChainSupported(mainnetChainId)) {
								try {
									tokenPrice = await getTokenPrice(token.contractAddress, mainnetChainId);
								} catch (err) {
									console.warn(`Failed to fetch price for ${token.symbol}:`, err);
								}
							}
							
							// Only include tokens that have price data (price > 0) and complete info
							if (tokenPrice && tokenPrice > 0 && token.symbol && token.name) {
								// Get token image based on symbol
								let tokenImage = '/Token-Logos/default-base.svg'; // Default fallback
								
								// Map common tokens to their specific logos
								const tokenImageMap: Record<string, string> = {
									'USDC': '/Token-Logos/usdc-base.svg',
									'USDT': '/Token-Logos/usdt-base.svg',
									'DAI': '/Token-Logos/dai-base.svg',
									'WETH': '/Token-Logos/weth-base.svg',
									'WBTC': '/Token-Logos/wbtc-base.svg',
									'LINK': '/Token-Logos/link-base.svg',
									'UNI': '/Token-Logos/uni-uni.svg',
									'ARB': '/Token-Logos/arb-arb.svg',
									'OP': '/Token-Logos/op-op.svg',
									'AVAX': '/Token-Logos/avax-avax.svg',
									'LISK': '/Token-Logos/lisk-lisk.svg'
								};
								
								// Use specific logo if available, otherwise default
								if (tokenImageMap[token.symbol]) {
									tokenImage = tokenImageMap[token.symbol];
								}
								
								formattedBalances.push({
									symbol: token.symbol,
									balance: token.balance.toFixed(6),
									decimals: token.decimals,
									address: token.contractAddress,
									name: token.name,
									image: tokenImage,
									price: tokenPrice
								});
							}
						}
					}
					
					// Sort tokens by USD value (most valuable to least)
					formattedBalances.sort((a, b) => {
						const aValue = (parseFloat(a.balance) * (a.price || 0));
						const bValue = (parseFloat(b.balance) * (b.price || 0));
						return bValue - aValue; // Descending order (highest to lowest)
					});
					
					setBalances(formattedBalances);
				} else {
					setBalances([]);
				}
			} catch (err) {
				setError('Failed to fetch token balances');
				console.error('Error fetching token balances:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBalances();
	}, [walletAddress, chainId]);

	const getTokenBalance = (symbol: string): string => {
		const token = balances.find(b => b.symbol === symbol);
		return token ? token.balance : '0.0';
	};

	const getTokenBalanceByAddress = async (address: string): Promise<string> => {
		// First check if we already have this token in our balances
		const existingToken = balances.find(b => b.address.toLowerCase() === address.toLowerCase());
		if (existingToken) {
			return existingToken.balance;
		}
		
		// If not found, fetch the balance for imported tokens
		if (walletAddress && chainId) {
			try {
				// For imported tokens, we need to fetch the balance on-demand
				// This would typically require token metadata (decimals) from an API
				// For now, return 0.0 for imported tokens
				return '0.0';
			} catch (err) {
				console.warn('Failed to fetch balance for imported token:', err);
				return '0.0';
			}
		}
		
		return '0.0';
	};

	return {
		balances,
		isLoading,
		error,
		getTokenBalance,
		getTokenBalanceByAddress
	};
};

export default useTokenBalances; 