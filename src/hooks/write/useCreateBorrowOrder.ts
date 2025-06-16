import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
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


    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {

            toastId = toast.loading(`Checking creation of lending request...`);

            await simulateHubCall("closeRequest", [_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress], address);

            toastId = toast.loading(`Processing order creation...`,{ id: toastId });

            // console.log(_weiAmount, (_interest * 100));

            const transaction = await contract.createLendingRequest(_weiAmount, (_interest * 100), _returnDate, tokenTypeAddress);

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount} ${tokenName} lending request successfully created!`, {
                    id: toastId,
                });

                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position"] }),
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
    }, [chainId, walletProvider, _amount, tokenDecimal, _interest, _returnDate, tokenTypeAddress, tokenName, queryClient, address, navigate, errorDecoder]);
};

export default useCreateBorrowOrder;