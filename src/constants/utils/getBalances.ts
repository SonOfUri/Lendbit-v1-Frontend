import { ethers } from "ethers";
import { readOnlyProvider } from "../../api/provider";
import { getERC20Contract } from "../../api/contractsInstance";



export const getEthBalance = async (address: string, chainId: number) => {
    const provider = readOnlyProvider(chainId);
    const balance = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(balance)).toFixed(3);
};

export const getTokenBalance = async (
    userAddress: string,
    tokenAddress: string,
    decimals: number,
    chainId: number
  ) => {
    const provider = readOnlyProvider(chainId);
    const tokenContract = getERC20Contract(provider, tokenAddress);
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.formatUnits(balance, decimals);
  };

