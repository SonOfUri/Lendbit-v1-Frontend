import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useQuery } from "@tanstack/react-query";
import { getERC20Contract } from "../../api/contractsInstance";
import { readOnlyProvider } from "../../api/provider";
import { envVars } from "../../constants/config/envVars";

// Define the special token address
const ETH_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000001";
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

const fetchAllowance = async ({
    queryKey,
}: {
    queryKey: [string, string, string, number];
}) => {
    const [, tokenTypeAddress, userAddress, chainId] = queryKey;

    if (!userAddress) return 0; 
    // Return MAX_SAFE_INTEGER for the special token address
    if (tokenTypeAddress === ETH_TOKEN_ADDRESS) {
        return MAX_SAFE_INTEGER;
    }

    const provider = readOnlyProvider(chainId);
    const destination = envVars.lendbitHubContractAddress;
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
    const { address, isConnected, chainId} = useWeb3ModalAccount();

    // Skip query entirely for the special token address
    const isSpecialToken = tokenTypeAddress === ETH_TOKEN_ADDRESS;
    
    return useQuery({
        queryKey: ["allowance", tokenTypeAddress, address || "", chainId ?? 0],
        queryFn: fetchAllowance,
        enabled: !!(isConnected && tokenTypeAddress && address && chainId) && !isSpecialToken,
        staleTime: 10_000, // Cache for 10 seconds
        ...(isSpecialToken ? { initialData: MAX_SAFE_INTEGER } : {}),
    });
};

export default useCheckAllowances;