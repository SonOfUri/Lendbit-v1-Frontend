import { ethers } from "ethers";
import { envVars } from "../constants/config/envVars";


const chainRpcMap: Record<number, string> = {
  84532: envVars.httpHubRPC,          // Base Sepolia
  421614: envVars.httpArbSpokeRPC,    // Arbitrum Sepolia
  43113: envVars.httpAvaxSpokeRPC,    // Avalanche Fuji
};

export const readOnlyProvider = (chainId: number) => {
  const rpcUrl = chainRpcMap[chainId];
  if (!rpcUrl) throw new Error(`Unsupported chain ID: ${chainId}`);
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getProvider = (provider: ethers.Eip1193Provider) =>
  new ethers.BrowserProvider(provider);

export const wssProvider = new ethers.WebSocketProvider(envVars.webSocketUrl);

export const readOnlyProviderHub = new ethers.JsonRpcProvider(
    envVars.httpHubRPC
);
