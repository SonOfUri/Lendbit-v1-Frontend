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
import { useNavigate } from "react-router-dom";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";

const useRequestLoanFromListing = (

) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    return useCallback(async (
        _orderId: number,
        _amount: string,
        tokenDecimal: number
    ) => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking borrow status...`);

            await simulateHubCall("requestLoanFromListing", [_orderId, _weiAmount], address);

            toast.loading(`Processing borrow transaction...`, { id: toastId });

            const transaction = await contract.requestLoanFromListing(_orderId, _weiAmount);
            
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} successfully borrowed!`, {
                    id: toastId,
                });
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position"] }),
                   
                ])

                navigate("/")
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
    }, [address, chainId, errorDecoder, navigate, queryClient, walletProvider]);
};

export default useRequestLoanFromListing;