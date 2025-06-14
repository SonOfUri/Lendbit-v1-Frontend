import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import { getERC20Contract, getLendbitContract, getPrankLendbitHubContract } from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import useCheckAllowances from "../read/useCheckAllowances";
import { envVars } from "../../constants/config/envVars";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";

const useSupplyLiquidity = (
    _amount: string,
    tokenTypeAddress: string,
    tokenDecimal: number,
    tokenName: string,
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);
    const { data: allowanceVal = 0, isLoading } = useCheckAllowances(tokenTypeAddress);
    const queryClient = useQueryClient();


    return useCallback(async () => {
        let toastId: string | number | undefined;
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");


        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);
        const contract = getLendbitContract(signer, chainId);

        const prankCall = getPrankLendbitHubContract(); 

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);


        try {

            toastId = toast.loading(`Checking Deposit of ${_amount}${tokenName}...`);

            await prankCall.deposit.staticCall(tokenTypeAddress, _weiAmount, {
                from: address, 
            });

            toast.loading(`Processing supply...` , { id: toastId });
            // console.log("AMOUNT OF SUPPLY IN WEI", _weiAmount);

            if (allowanceVal === 0 || allowanceVal < Number(_weiAmount)) {
                toast.loading(`Approving tokens...`, { id: toastId });

                const allowance = await erc20contract.approve(
                    envVars.lendbitHubContractAddress,
                    MaxUint256
                );
                const allowanceReceipt = await allowance.wait();

                if (!allowanceReceipt.status) {
                    return toast.error("Approval failed!", { id: toastId });
                }
            }

            toast.loading(`Processing supply of ${_amount} ${tokenName}...`, { id: toastId })

            const transaction = await contract.deposit(tokenTypeAddress, _weiAmount);
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} successfully supplied, happy earning!`, {
                    id: toastId,
                });
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position"] }),
                    
                ])
            }
        }catch (error: unknown) {
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
    }, [_amount, address, allowanceVal, chainId, errorDecoder, isLoading, queryClient, tokenDecimal, tokenName, tokenTypeAddress, walletProvider]);
};

export default useSupplyLiquidity;