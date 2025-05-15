import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChain } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import { getLendbitContract } from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

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
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);
        // console.log('Amount (normal):', _amount);
        // console.log('Amount in wei:', _weiAmount.toString());

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing borrowing...`);

            const transaction = await contract.borrowFromPool(tokenTypeAddress, _weiAmount);

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} ${tokenName} borrowed successfully!`, {
                    id: toastId,
                });

                queryClient.invalidateQueries({ queryKey: ["dashboard", address] });
                queryClient.invalidateQueries({ queryKey: ["market"] });
                queryClient.invalidateQueries({ queryKey: ["position"] });
                queryClient.invalidateQueries({ queryKey: ["tokens"] });
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`Transaction failed: ${decodedError.reason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, walletProvider, queryClient, address, errorDecoder]);
};

export default useCreatePositionPool;