import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChain } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import {
    getERC20Contract,
    getLendbitContract,
} from "../../api/contractsInstance";
import lenbit from "../../abi/LendBit.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { envVars } from "../../constants/config/envVars";
import useCheckAllowances from "../read/useCheckAllowances";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

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
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lenbit);
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing repayments...`);

            if (allowanceVal == 0 || allowanceVal < Number(_amount)) {
                toast.loading(`Approving tokens...`, { id: toastId });
                const allowance = await erc20contract.approve(
                    envVars.lendbitContractAddress,
                    MaxUint256
                );
                const allowanceReceipt = await allowance.wait();

                if (!allowanceReceipt.status)
                    return toast.error("Approval failed!", { id: toastId });
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
                    queryClient.invalidateQueries({ queryKey: ["position"] }),
                   
                ])

            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`Repayment failed: ${decodedError.reason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Repayment failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, walletProvider, tokenTypeAddress, _amount, tokenDecimal, allowanceVal, _requestId, queryClient, address, errorDecoder]);
};

export default useRepayP2P;