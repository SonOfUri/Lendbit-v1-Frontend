import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import {
    getERC20Contract,
    getLendbitContract,
} from "../../api/contractsInstance";
import lenbit from "../../abi/LendBit.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import useCheckAllowances from "../read/useCheckAllowances";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { CHAIN_CONTRACTS } from "../../constants/config/chains";

const useRepayP2P = (
    _amount: string,
    _requestId: number,
    tokenTypeAddress: string,
    tokenDecimal: number,
) => {
    const { chainId,address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { data: allowanceVal = 0, isLoading } = useCheckAllowances(tokenTypeAddress);

    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lenbit]);

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking repayments...`);
            

            if (allowanceVal == 0 || allowanceVal < Number(_weiAmount)) {
                if (typeof chainId === 'undefined') {
                    toast.error("Chain ID is undefined - please connect your wallet");
                    return;
                }
            
                toast.loading(`Approving tokens...`, { id: toastId });
                const allowanceTx = await erc20contract.approve(
                    CHAIN_CONTRACTS[chainId].lendbitAddress, // Now safe to use
                    MaxUint256
                );
                const allowanceReceipt = await allowanceTx.wait();
            
                if (!allowanceReceipt.status) {
                    toast.error("Approval failed!", { id: toastId });
                }
            }

            toast.loading(`Processing repayment of ${_amount}...`, { id: toastId })

            const transaction = await contract.repayLoan(
                _requestId,
                _weiAmount
            );
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`loan ${_requestId} successfully repayed!`, {
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
                toast.error(`Transaction failed: ${friendlyReason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, walletProvider, tokenTypeAddress, _amount, tokenDecimal, allowanceVal, _requestId, queryClient, address, errorDecoder]);
};

export default useRepayP2P;