import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import { getLendbitContract, simulateHubCall, } from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import { ErrorDecoder } from "ethers-decode-error";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";

const useCloseRequest = (
    _requestId: number,
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit]);

    const queryClient = useQueryClient();

    const isHubChain = chainId === SUPPORTED_CHAINS_ID[0];

    const {
        refetch: fetchGasPrice,
    } = useGetGas({
        messageType: CCIPMessageType.CLOSE_REQUEST,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
            requestId: _requestId,
            sender: address || "",
        },
    });

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (!_requestId) return toast.error("Invalid requestId");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);


        let toastId: string | number | undefined;

        try {

            toastId = toast.loading(`Checking closing Ad position of ${_requestId}...`);

            await simulateHubCall("closeRequest", [_requestId], address);

            toast.loading(`closing ads position...`, { id: toastId });

            let transaction;

            if (isHubChain) {
                transaction = await contract.closeRequest(
                    _requestId,
                );
            } else {
                let finalGasPrice = 0n;
                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                transaction = await contract.closeRequest(_requestId, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                if (isHubChain) {
                    toast.success(`request of id #${_requestId} closed!`, {
                        id: toastId,
                    });
                } else {
                    toast.success(`x-chain close request id #${_requestId} message sent!`, {
                        id: toastId,
                    });
                }
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
    }, [chainId, walletProvider, _requestId, address, isHubChain, fetchGasPrice, queryClient, errorDecoder]);
};

export default useCloseRequest;