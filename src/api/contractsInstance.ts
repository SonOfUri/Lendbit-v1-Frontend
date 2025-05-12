import { ethers } from "ethers";
import multicall2 from "../abi/multicall2.json"
import erc20 from "../abi/erc20.json"
import { envVars } from "../constants/config/envVars";



export const getLendbitContract = (providerOrSigner: ethers.Provider | ethers.Signer, PoolorPerrAbi : ethers.InterfaceAbi) =>
    new ethers.Contract(
        envVars.lendbitContractAddress || "",
        PoolorPerrAbi,
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