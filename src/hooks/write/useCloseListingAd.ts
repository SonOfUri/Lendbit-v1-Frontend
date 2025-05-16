import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChain } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import { getLendbitContract, } from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import { ErrorDecoder } from "ethers-decode-error";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

const useCloseListingAd = (
   
) => {
    const { chainId,address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit]);

    const queryClient = useQueryClient();


    return useCallback(async ( _requestId: number,) => {
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);


        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`closing ads position...`);


            const transaction = await contract.closeListingAd(
                _requestId,
            );
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`ads position of ${_requestId} closed!`, {
                    id: toastId,
                });
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position"] }),
                ])
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`ads closing failed: ${decodedError.reason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Closing Ad failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, walletProvider, queryClient, address, errorDecoder]);
};

export default useCloseListingAd;