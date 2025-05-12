import { ethers } from "ethers";
import { readOnlyProvider } from "../../api/provider";
import { getERC20Contract } from "../../api/contractsInstance";


export const getEthBalance = async (address: string) => {
    const balance = await readOnlyProvider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    return parseFloat(balanceInEth).toFixed(3);
};

export const getTokenBalance = async (userAddress: string, tokenAddress:string, decimal : number) => {
    const tokenContract = getERC20Contract(readOnlyProvider, tokenAddress)
    const balance = await tokenContract.balanceOf(userAddress);
    // console.log("BALANCES", balance);
    
    return ethers.formatUnits(balance, decimal);
};

