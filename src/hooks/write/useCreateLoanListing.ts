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
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { envVars } from "../../constants/config/envVars";
import useCheckAllowances from "../read/useCheckAllowances";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

const useCreateLoanListingOrder = (
    _amount: string,
    _min_amount: string,
    _max_amount: string,
    _interest: number,
    _returnDate: number,
    tokenTypeAddress: string,
    tokenDecimal: number,
    tokenName: string,
    whitelist: string[],
) => {
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { data: allowanceVal = 0, isLoading } = useCheckAllowances(tokenTypeAddress);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, lendbit);
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);

        const _weiAmount = ethers.parseUnits(_amount, tokenDecimal);
        const _min_amount_wei = ethers.parseUnits(_min_amount, tokenDecimal);
        const _max_amount_wei = ethers.parseUnits(_max_amount, tokenDecimal);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Processing... Finding matches...`);

            if (allowanceVal == 0 || allowanceVal < Number(_weiAmount)) {
                toast.loading(`Approving ${tokenName} tokens...`, { id: toastId });
                const allowance = await erc20contract.approve(
                    envVars.lendbitContractAddress,
                    MaxUint256
                );
                const allowanceReceipt = await allowance.wait();

                if (!allowanceReceipt.status)
                    return toast.error("Approval failed!", { id: toastId });
            }

            toast.loading(`Processing loan listing of ${_amount}${tokenName}...`, { id: toastId })

            // console.log("SEEING VALUES FOR createLoanListingWithMatching",_weiAmount,_min_amount_wei,_max_amount_wei,_returnDate,_interest,tokenTypeAddress );


            const transaction = await contract.createLoanListing(
                _weiAmount,
                _min_amount_wei,
                _max_amount_wei,
                _returnDate,
                (_interest * 100),
                tokenTypeAddress,
                whitelist
            );
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} loan listing order successfully created!`, {
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
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`Transaction failed: ${decodedError.reason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, walletProvider, tokenTypeAddress, _amount, tokenDecimal, _min_amount, _max_amount, allowanceVal, tokenName, _returnDate, _interest, whitelist, queryClient, address, navigate, errorDecoder]);
};

export default useCreateLoanListingOrder;