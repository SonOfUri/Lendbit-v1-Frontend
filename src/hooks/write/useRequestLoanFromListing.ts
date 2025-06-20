import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback, useMemo } from "react";
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
import { SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";
import useGetGas from "../read/useGetGas";

const useRequestLoanFromListing = (
    _orderId: number,
    _amount: string,
    tokenDecimal: number
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const navigate = useNavigate();

    const queryClient = useQueryClient();


    const _weiAmount = useMemo(() => {
        if (!_amount || isNaN(Number(_amount))) return null;
        try {
            return ethers.parseUnits(_amount, tokenDecimal);
        } catch {
            return null;
        }
    }, [_amount, tokenDecimal]);

    const isHubChain = chainId === SUPPORTED_CHAINS_ID[0];

    const {
        refetch: fetchGasPrice,
    } = useGetGas({
        messageType: CCIPMessageType.BORROW_FROM_LISTING,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
            listingId: _orderId,
            amount: _weiAmount ? _weiAmount.toString() : "0",
            sender: address || "",
        },
    });


    return useCallback(async (

    ) => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking borrow status...`);

            await simulateHubCall("requestLoanFromListing", [_orderId, _weiAmount], address);

            toast.loading(`Processing borrow transaction...`, { id: toastId });

            let transaction;

            if (isHubChain) {
                transaction = await contract.requestLoanFromListing(_orderId, _weiAmount);
            } else {

                let finalGasPrice = 0n;

                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                transaction = await contract.requestLoanFromListing(_orderId, _weiAmount, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                if (isHubChain) {
                    toast.success(`${_amount} successfully borrowed!`, {
                        id: toastId,
                    });
                } else {
                    toast.success(`x-chain ${_amount} borrow message sent!`, {
                        id: toastId,
                    });
                }
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position", address] }),

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
    }, [_amount, _orderId, _weiAmount, address, chainId, errorDecoder, fetchGasPrice, isHubChain, navigate, queryClient, walletProvider]);
};

export default useRequestLoanFromListing;