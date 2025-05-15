import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useQuery } from "@tanstack/react-query";
import { getERC20Contract } from "../../api/contractsInstance";
import { readOnlyProvider } from "../../api/provider";
import { envVars } from "../../constants/config/envVars";

const fetchAllowance = async ({
    queryKey,
}: {
    queryKey: [string, string, string];
}) => {
    const [, tokenTypeAddress, userAddress] = queryKey;

    if (!userAddress) return 0; // Ensure user is connected

    const provider = readOnlyProvider;
    const destination = envVars.lendbitContractAddress;
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
    const { address, isConnected } = useWeb3ModalAccount();

    return useQuery({
        queryKey: ["allowance", tokenTypeAddress, address || ""],
        queryFn: fetchAllowance,
        enabled: !!(isConnected && tokenTypeAddress),
        staleTime: 10_000, // Cache for 10 seconds
    });
};

export default useCheckAllowances;


