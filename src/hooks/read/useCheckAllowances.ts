import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useQuery } from "@tanstack/react-query";
import { getERC20Contract } from "../../api/contractsInstance";
import { readOnlyProvider } from "../../api/provider";
import { CHAIN_CONTRACTS } from "../../constants/config/chains";
import { MaxUint256 } from "ethers";

// Define the special token address
const ETH_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000001";


const MAX_SAFE_INTEGER = Number(MaxUint256);
console.log("MAX_SAFE_INTEGER", MAX_SAFE_INTEGER);

const fetchAllowance = async ({
    queryKey,
}: {
    queryKey: [string, string, string, number];
}) => {
    const [, tokenTypeAddress, userAddress, chainId] = queryKey;

    if (!userAddress) return 0; 
    
 
    const provider = readOnlyProvider(chainId);
    const destination = CHAIN_CONTRACTS[chainId].lendbitAddress;
    const contract = getERC20Contract(provider, tokenTypeAddress);

    try {
        const allowance = await contract.allowance(userAddress, destination);
        return Number(allowance);
    } catch (error) {
        console.error("Error fetching allowance: ", error);
        return 0;
    }
};


const useCheckAllowances = (tokenTypeAddress: string) => {
    const { address, isConnected, chainId } = useWeb3ModalAccount();
  
    const isSpecialToken = tokenTypeAddress === ETH_TOKEN_ADDRESS;

    
  
    return useQuery({
      queryKey: ["allowance", tokenTypeAddress, address || "", chainId ?? 0],
      queryFn: fetchAllowance,
      enabled: !!(isConnected && tokenTypeAddress && address && chainId) && !isSpecialToken,
      staleTime: 10_000_000_000_000,
      initialData: isSpecialToken ? MAX_SAFE_INTEGER : undefined,
    });
  };

export default useCheckAllowances;