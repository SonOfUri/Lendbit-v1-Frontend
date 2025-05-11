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
import { useNavigate } from "react-router-dom";
import { Eip1193Provider } from "ethers";

const useRemoveLiquidity = (
    _amount: string,
    tokenTypeAddress: string,
    tokenDecimal: number
) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing withdrawal...`);

            const transaction = await contract.withdraw(tokenTypeAddress, _weiAmount);
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} successfully withdrawn!`, {
                    id: toastId,
                });
                queryClient.invalidateQueries({ queryKey: ["userUtilities"] });
                queryClient.invalidateQueries({ queryKey: ["getAPR&APY"] });
                queryClient.invalidateQueries({ queryKey: ["getTotalSupplyBorrow"] });
                queryClient.invalidateQueries({ queryKey: ["userPosition"] });
                navigate("/")
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                console.error("Transaction failed:", decodedError);
                toast.error(`Transaction failed: ${decodedError}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [_amount, chainId, errorDecoder, navigate, queryClient, tokenDecimal, tokenTypeAddress, walletProvider]);
};

export default useRemoveLiquidity;