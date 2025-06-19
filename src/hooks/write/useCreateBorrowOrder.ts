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
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";

const useCreateBorrowOrder = (
    _amount: string,
    _interest: number,
    _returnDate: number,
    tokenTypeAddress: string,
    tokenDecimal: number,
    // expirationDate: number,
    tokenName: string,
    // collateralTokens: string[],
    // collateralAmounts: number[],
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const queryClient = useQueryClient();
    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const navigate = useNavigate();

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
        messageType: CCIPMessageType.CREATE_REQUEST,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
          amount: _weiAmount ? _weiAmount.toString() : "0",
          interest: (_interest * 100),
          returnDate: _returnDate,
          tokenAddress: tokenTypeAddress,
          sender: address || "",
        },
      });


    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        let toastId: string | number | undefined;

        try {

            toastId = toast.loading(`Checking creation of lending request...`);

            await simulateHubCall("createLendingRequest", [_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress], address);

            toastId = toast.loading(`Processing order creation...`,{ id: toastId });

            console.log(_weiAmount, (_interest * 100));

            let transaction;
            if (isHubChain) {
                transaction = await contract.createLendingRequest(_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress);
            } else {

                let finalGasPrice = 0n;

                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                transaction = await contract.createLendingRequest(_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} ${tokenName} lending request successfully created!`, {
                    id: toastId,
                });

                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position", address] }),
                ])

                navigate("/markets")
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
    }, [chainId, walletProvider, _weiAmount, _interest, _returnDate, tokenTypeAddress, address, isHubChain, fetchGasPrice, _amount, tokenName, queryClient, navigate, errorDecoder]);
};

export default useCreateBorrowOrder;