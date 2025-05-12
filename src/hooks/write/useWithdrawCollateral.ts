import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChain } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import useCheckAllowances from "../read/useCheckAllowances";
import {
    getERC20Contract,
    getLendbitContract,
} from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers, MaxUint256 } from "ethers";
import { envVars } from "../../constants/config/envVars";
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

const useWithdrawCollateral = (
    tokenTypeAddress: string,
    _amount: string,
    tokenDecimal: number,
    tokenName: string,
) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");


        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);
        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing withdraw collateral transaction...`);

            toast.loading(`Processing withdrawal of ${_amount}${tokenName}...`, { id: toastId })

            // **Proceed with withdraw**
            const transaction = await contract.withdrawCollateral(tokenTypeAddress, _weiAmount);
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} successfully withdrawn!`, {
                    id: toastId,
                });
                queryClient.invalidateQueries({ queryKey: ["userUtilities"] });
                queryClient.invalidateQueries({ queryKey: ["userPosition"] });
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
    }, [chainId, walletProvider, tokenTypeAddress, _amount, tokenDecimal, tokenName, queryClient, navigate, errorDecoder]);
};

export default useWithdrawCollateral;