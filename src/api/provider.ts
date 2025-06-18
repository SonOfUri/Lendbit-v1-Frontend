import { ethers } from "ethers";
import { envVars } from "../constants/config/envVars";
import { chainRpcMap } from "../constants/config/chains";




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
