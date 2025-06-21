import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback, useMemo } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import {
    getLendbitContract,
    getPrankLendbitHubContract,
} from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";

const useWithdrawCollateral = (
    tokenTypeAddress: string,
    _amount: string,
    tokenDecimal: number,
    tokenName: string,
    hubTokenAddress: string,
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

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
        messageType: CCIPMessageType.WITHDRAW_COLLATERAL,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
            tokenAddress: tokenTypeAddress,
            amount: _weiAmount ? _weiAmount.toString() : "0",
            sender: address || "",
        },
    });

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (!_weiAmount) return toast.error("Invalid amount");


        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        const prankCall = getPrankLendbitHubContract();

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking Collateral withdrawal of ${_amount}${tokenName}...`);

            await prankCall.withdrawCollateral.staticCall(hubTokenAddress, _weiAmount, {
                from: address,
            });

            toast.loading(`Processing withdrawal of ${_amount}${tokenName}...`, { id: toastId })

            // **Proceed with withdraw**      

            let transaction;

            if (isHubChain) {
                transaction = await contract.withdrawCollateral(tokenTypeAddress, _weiAmount);
            } else {

                let finalGasPrice = 0n;

                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                transaction = await contract.withdrawCollateral(tokenTypeAddress, _weiAmount, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                if (isHubChain) {
                    toast.success(`${_amount}${tokenName} successfully withdrawn!`, {
                        id: toastId,
                    });
                } else {
                    toast.success(`${_amount}${tokenName} x-chain withdraw message sent!`, {
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
    }, [chainId, _weiAmount, walletProvider, _amount, tokenName, hubTokenAddress, address, isHubChain, tokenTypeAddress, fetchGasPrice, queryClient, navigate, errorDecoder]);
};

export default useWithdrawCollateral;