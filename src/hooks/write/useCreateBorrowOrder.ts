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
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

const useCreateBorrowOrder = (
    _amount: string,
    _interest: number,
    _returnDate: number,
    tokenTypeAddress: string,
    tokenDecimal: number,
    expirationDate: number,
    tokenName: string,
    // collateralTokens: string[],
    // collateralAmounts: number[],
) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const queryClient = useQueryClient();
    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const navigate = useNavigate();


    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing order creation...`);

            const transaction = await contract.createLendingRequest(_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress);

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} ${tokenName} lending request successfully created!`, {
                    id: toastId,
                });
                queryClient.invalidateQueries({ queryKey: ["allBorrowRequests"] });
                navigate("/")
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`Transaction failed: ${decodedError.reason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, walletProvider, _amount, tokenDecimal, _interest, _returnDate, expirationDate, tokenTypeAddress, tokenName, queryClient, navigate, errorDecoder]);
};

export default useCreateBorrowOrder;