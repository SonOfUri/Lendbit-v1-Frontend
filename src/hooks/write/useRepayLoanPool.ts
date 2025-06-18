import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback, useMemo } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import {
    getERC20Contract,
    getLendbitContract,
} from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import useCheckAllowances from "../read/useCheckAllowances";
import { Eip1193Provider } from "ethers";
import { useQueryClient } from "@tanstack/react-query";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { CHAIN_CONTRACTS, SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";
import useGetGas from "../read/useGetGas";

const useRepayPool = (
    _amount: string,
    tokenTypeAddress: string,
    tokenDecimal: number,
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { data: allowanceVal = 0, isLoading } = useCheckAllowances(tokenTypeAddress);

    const errorDecoder = ErrorDecoder.create([lendbit]);

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
        messageType: CCIPMessageType.REPAY,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
          tokenAddress: tokenTypeAddress,
          amount: _weiAmount ? _weiAmount.toString() : "0",
          sender: address || "",
        },
    });


    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");
        if (!_weiAmount) return toast.error("Invalid amount");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);

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
                CHAIN_CONTRACTS[chainId].lendbitAddress, 
                MaxUint256
            );
            const allowanceReceipt = await allowanceTx.wait();
        
            if (!allowanceReceipt.status) {
                toast.error("Approval failed!", { id: toastId });
            }
            }
            
            toast.loading(`Processing repayment of ${_amount}...`, { id: toastId })

            let transaction;

            if (isHubChain) {
                transaction = await contract.repay(tokenTypeAddress, _weiAmount);
            } else {

                let finalGasPrice = 0n;

                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                transaction = await contract.repay(tokenTypeAddress, _weiAmount, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`loan of ${_amount} successfully repayed!`, {
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
    }, [chainId, isLoading, _weiAmount, walletProvider, tokenTypeAddress, allowanceVal, _amount, isHubChain, fetchGasPrice, queryClient, address, errorDecoder]);
};

export default useRepayPool;