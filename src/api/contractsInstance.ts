/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import multicall2 from "../abi/multicall2.json"
import erc20 from "../abi/erc20.json"
import lendbit from "../abi/LendBit.json";
import lendbit2 from "../abi/LendBitOld.json";
import { envVars } from "../constants/config/envVars";
import { CHAIN_CONTRACTS } from "../constants/config/chains";



export const getLendbitContract = (
  providerOrSigner: ethers.Provider | ethers.Signer,
  chainId: any
) => {
  const chainConfig = (CHAIN_CONTRACTS as Record<number, { name: string; lendbitAddress: string }>)[chainId];
  if (!chainConfig) throw new Error(`Unsupported chain ID: ${chainId}`);

  return new ethers.Contract(chainConfig.lendbitAddress, lendbit, providerOrSigner);
};



export const getLendbitHubContract = (providerOrSigner: ethers.Provider | ethers.Signer) =>
    new ethers.Contract(
        envVars.lendbitHubContractAddress || "",
        lendbit2,
        providerOrSigner
);


export const getMulticallContract = (providerOrSigner: ethers.Provider | ethers.Signer) =>
    new ethers.Contract(
        envVars.multicallContract || "",
        multicall2,
        providerOrSigner
    );


export const getERC20Contract = (providerOrSigner: ethers.Provider | ethers.Signer, tokenAddress: string) =>
    new ethers.Contract(
        tokenAddress,
        erc20,
        providerOrSigner
    );