import { envVars } from "./envVars";

export const SUPPORTED_CHAINS_ID = [84532, 421614, 43113];
// baseSepolia, arbitrumSepolia, avaxSepolia, 

export const CHAIN_CONTRACTS = {
    84532: {
      name: "Base Sepolia",
      lendbitAddress: envVars.lendbitHubContractAddress,
    },
    421614: {
      name: "Arbitrum Sepolia",
      lendbitAddress: envVars.lendbitArbSpokeContractAddress,
    },
    43113: {
      name: "Avalanche Fuji",
      lendbitAddress: envVars.lendbitAvaxSpokeContractAddress,
    },
};
  

export const CHAIN_NATIVE_SYMBOLS: Record<number, string> = {
    84532: "ETH",     // Base Sepolia
    421614: "ETH",    // Arbitrum Sepolia
    43113: "AVAX",    // Avalanche Fuji
};
  

