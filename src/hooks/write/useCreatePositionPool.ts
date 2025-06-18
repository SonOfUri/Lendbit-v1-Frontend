import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import { getLendbitContract, simulateHubCall } from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";

const useCreatePositionPool = (

    // collateralTokens: string[],
    // collateralAmounts: number[],
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const queryClient = useQueryClient();


    return useCallback(async (
        _amount: string,
        tokenTypeAddress: string,
        tokenDecimal: number,
        tokenName: string
    ) => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);
        // console.log('Amount (normal):', _amount);
        // console.log('Amount in wei:', _weiAmount.toString());

        let toastId: string | number | undefined;

        try {

            toastId = toast.loading(`Checking borrowing from pool...`);

            await simulateHubCall("borrowFromPool", [tokenTypeAddress, _weiAmount], address);
            
            toast.loading(`Processing borrowing...`, { id: toastId });

            const transaction = await contract.borrowFromPool(tokenTypeAddress, _weiAmount);

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} ${tokenName} borrowed successfully!`, {
                    id: toastId,
                });

                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position", address] }),
                ])
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                let friendlyReason = "error";
                if (decodedError.reason !== null) {
                    friendlyReason = formatCustomError(decodedError.reason);
                }
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`This transaction is expected to fail: ${friendlyReason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, walletProvider, queryClient, address, errorDecoder]);
};

export default useCreatePositionPool;