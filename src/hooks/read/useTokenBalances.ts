import { useState, useEffect } from 'react';
import { getEthBalance, getTokenBalance } from '../../constants/utils/getBalances';
import { tokenMockedData } from '../../constants/utils/tokenMockedData';

interface TokenBalance {
	symbol: string;
	balance: string;
	decimals: number;
	address: string;
	price?: number;
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
			// Fetch real balances using existing utilities
			const balances: TokenBalance[] = [];
			
			// Get ETH balance
			const ethBalance = await getEthBalance(walletAddress, chainId);
			const ethTokenData = tokenMockedData.find(t => t.symbol === 'ETH');
			
			if (ethTokenData) {
				balances.push({
					symbol: 'ETH',
					balance: ethBalance,
					decimals: 18,
					address: '0x0000000000000000000000000000000000000000',
					price: ethTokenData.price
				});
			}
			
			// Get token balances for other tokens
			for (const token of tokenMockedData) {
				if (token.symbol !== 'ETH') {
					try {
						const balance = await getTokenBalance(
							walletAddress,
							token.address,
							token.decimals,
							chainId
						);
						
						// Only add tokens with non-zero balance
						if (parseFloat(balance) > 0) {
							balances.push({
								symbol: token.symbol,
								balance: parseFloat(balance).toFixed(6),
								decimals: token.decimals,
								address: token.address,
								price: token.price
							});
						}
					} catch (err) {
						console.warn(`Failed to fetch balance for ${token.symbol}:`, err);
					}
				}
			}

			setBalances(balances);
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