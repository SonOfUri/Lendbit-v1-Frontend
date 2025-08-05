// Chain mapping from testnet to mainnet
export const CHAIN_MAPPING = {
  // Testnet → Mainnet
  '84532': '8453',    // Base Sepolia → Base
  '11155420': '10',   // Optimism Sepolia → Optimism
  '421614': '42161',  // Arbitrum Sepolia → Arbitrum
};

// Check if a chain is testnet
export const isTestnetChain = (chainId: number): boolean => {
  return Object.keys(CHAIN_MAPPING).includes(chainId.toString());
};

// Get mainnet chain ID from testnet
export const getMainnetChainId = (chainId: number): string => {
  return CHAIN_MAPPING[chainId.toString() as keyof typeof CHAIN_MAPPING] || chainId.toString();
};

// Get chain name for display
export const getChainName = (chainId: number): string => {
  const chainNames: Record<string, string> = {
    '8453': 'Base',
    '10': 'Optimism',
    '42161': 'Arbitrum',
    '84532': 'Base Sepolia',
    '11155420': 'Optimism Sepolia',
    '421614': 'Arbitrum Sepolia',
  };
  return chainNames[chainId.toString()] || 'Unknown';
}; 