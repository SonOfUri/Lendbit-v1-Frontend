import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
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

const useWithdrawPool = (
    tokenTypeAddress: string,
    _amount: string,
    tokenDecimal: number,
    tokenName: string,
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        
        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);

        const prankCall = getPrankLendbitHubContract();

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);
        let toastId: string | number | undefined;

        
        try {

            toastId = toast.loading(`Checking withdrawal of ${_amount}${tokenName}...`);

            await prankCall.withdraw.staticCall(tokenTypeAddress, _weiAmount, {
                from: address, // address of the connected user
            });

            toast.loading(`Processing withdrawal of ${_amount}${tokenName} supplied...`, { id: toastId })

            // **Proceed with withdraw**
            const transaction = await contract.withdraw(tokenTypeAddress, _weiAmount);
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} supplied successfully withdrawn!`, {
                    id: toastId,
                });
                
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

    }, [chainId, walletProvider, _amount, tokenDecimal, tokenName, tokenTypeAddress, queryClient, address, navigate, errorDecoder]);
};

export default useWithdrawPool;


