import { envVars } from "./envVars";

export const SUPPORTED_CHAINS_ID = [84532, 421614, 11155420];
// baseSepolia, arbitrumSepolia, avaxSepolia, 

export const CHAIN_CONTRACTS: Record<number, { name: string; lendbitAddress: string }> = {
  84532: {
      name: "Base Sepolia",
      lendbitAddress: envVars.lendbitHubContractAddress,
    },
    421614: {
      name: "Arbitrum Sepolia",
      lendbitAddress: envVars.lendbitArbSpokeContractAddress,
    },
    11155420: {
      name: "Optimism Sepolia",
      lendbitAddress: envVars.lendbitOpSpokeContractAddress,
    },
};
  

export const CHAIN_NATIVE_SYMBOLS: Record<number, string> = {
    84532: "ETH",     // Base Sepolia
    421614: "ETH",    // Arbitrum Sepolia
    43113: "AVAX",    // Avalanche Fuji
    11155420: "ETH", // Optimism Sepolia
};
  

export const chainRpcMap: Record<number, string> = {
  84532: envVars.httpHubRPC,          // Base Sepolia
  421614: envVars.httpArbSpokeRPC,    // Arbitrum Sepolia
  43113: envVars.httpAvaxSpokeRPC,    // Avalanche Fuji
  11155420: envVars.httpOpSpokeRPC,   // Optimism Sepolia
};


export const chains = [
  {
    name: "Base",
    icon: "/Token-Logos/base-base.svg",
    type: "hub" as const,
    chainId: 84532,
  },
  {
    name: "Optimism",
    icon: "/Token-Logos/op-op.svg",
    type: "spoke" as const,
    chainId: 11155420,
  },

  {
    name: "Arbitrum",
    icon: "/Token-Logos/arb-arb.svg",
    type: "spoke" as const,
    chainId: 421614,
  },
];


export const isSpokeChain = (chainId?: number) =>
  chainId === 421614 || chainId === 11155420; // Arbitrum Sepolia, Optimism Sepolia