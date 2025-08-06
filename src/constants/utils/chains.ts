// import { SUPPORTED_CHAIN_ID } from "../../api/connection";
import { SUPPORTED_CHAINS_ID } from "../config/chains";


// export const isSupportedChain = (
//   chainId: number | undefined
// ): chainId is number =>
//   chainId !== undefined && Number(chainId) === SUPPORTED_CHAIN_ID;


export const isSupportedChains = (
  chainId: number | undefined
): boolean => chainId !== undefined && SUPPORTED_CHAINS_ID.includes(chainId);

// Mainnet chain IDs for swap functionality
export const MAINNET_CHAINS_ID = [8453, 10, 42161]; // Base, Optimism, Arbitrum

// Check if chain is supported including mainnet chains (for swap page)
export const isSupportedChainsIncludingMainnet = (
  chainId: number | undefined,
  includeMainnet: boolean = false
): boolean => {
  if (chainId === undefined) return false;
  
  if (includeMainnet) {
    return SUPPORTED_CHAINS_ID.includes(chainId) || MAINNET_CHAINS_ID.includes(chainId);
  }
  
  return SUPPORTED_CHAINS_ID.includes(chainId);
};