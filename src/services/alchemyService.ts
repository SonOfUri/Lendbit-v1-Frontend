import { Alchemy, Network } from 'alchemy-sdk';

// Alchemy API configuration for each chain
const ALCHEMY_CONFIG = {
  BASE: {
    apiKey: 'k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    url: 'https://base-mainnet.g.alchemy.com/v2/k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    network: Network.BASE_MAINNET,
  },
  OPTIMISM: {
    apiKey: 'k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    url: 'https://opt-mainnet.g.alchemy.com/v2/k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    network: Network.OPT_MAINNET,
  },
  ARBITRUM: {
    apiKey: 'k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    url: 'https://arb-mainnet.g.alchemy.com/v2/k9OHhRQJR82NaxGSXVJylLjXlno6QPHI',
    network: Network.ARB_MAINNET,
  },
};

// Create Alchemy instances for each chain
const alchemyInstances = {
  BASE: new Alchemy(ALCHEMY_CONFIG.BASE),
  OPTIMISM: new Alchemy(ALCHEMY_CONFIG.OPTIMISM),
  ARBITRUM: new Alchemy(ALCHEMY_CONFIG.ARBITRUM),
};

// Chain ID to Alchemy instance mapping
const CHAIN_TO_ALCHEMY: Record<number, Alchemy> = {
  8453: alchemyInstances.BASE,    // Base mainnet
  10: alchemyInstances.OPTIMISM,   // Optimism mainnet
  42161: alchemyInstances.ARBITRUM, // Arbitrum mainnet
};

// Token balance interface
export interface TokenBalance {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
  decimals: number;
  logo?: string;
}

// Wallet balances interface
export interface WalletBalances {
  eth: number;
  tokens: TokenBalance[];
}

// Get Alchemy instance for a chain
export const getAlchemyInstance = (chainId: number): Alchemy | null => {
  return CHAIN_TO_ALCHEMY[chainId] || null;
};

// Get wallet balances for a specific chain
export const getWalletBalances = async (address: string, chainId: number): Promise<WalletBalances | null> => {
  const alchemy = getAlchemyInstance(chainId);
  if (!alchemy) {
    console.warn(`Alchemy not supported for chain ${chainId}`);
    return null;
  }

  try {
    // Get all token balances
    const balances = await alchemy.core.getTokenBalances(address);
    
    // Get ETH balance
    const ethBalance = await alchemy.core.getBalance(address);
    const ethFormatted = Number(BigInt(ethBalance)) / 10 ** 18;
    
    const tokens: TokenBalance[] = [];
    
    // Process each token
    for (let token of balances.tokenBalances) {
      if (!token.tokenBalance || token.tokenBalance === "0" || token.tokenBalance === "0x0") continue;
      
      try {
        const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
        const formattedBalance = Number(BigInt(token.tokenBalance)) / 10 ** metadata.decimals;
        
        tokens.push({
          name: metadata.name,
          symbol: metadata.symbol,
          balance: formattedBalance,
          contractAddress: token.contractAddress,
          decimals: metadata.decimals,
        });
      } catch (error) {
        console.warn(`Failed to get metadata for token ${token.contractAddress}:`, error);
      }
    }
    
    return {
      eth: ethFormatted,
      tokens: tokens
    };
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    return null;
  }
};

// Get token metadata for a specific token
export const getTokenMetadata = async (contractAddress: string, chainId: number) => {
  const alchemy = getAlchemyInstance(chainId);
  if (!alchemy) {
    console.warn(`Alchemy not supported for chain ${chainId}`);
    return null;
  }

  try {
    const metadata = await alchemy.core.getTokenMetadata(contractAddress);
    return {
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
      contractAddress: contractAddress,
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
};

// Check if a chain is supported by Alchemy
export const isChainSupported = (chainId: number): boolean => {
  return chainId in CHAIN_TO_ALCHEMY;
}; 