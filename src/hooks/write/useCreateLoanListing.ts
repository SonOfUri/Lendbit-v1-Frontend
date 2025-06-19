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
import erc20 from "../../abi/erc20.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import useCheckAllowances from "../read/useCheckAllowances";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { CHAIN_CONTRACTS, SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";

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

    const _weiAmount = useMemo(() => {
        if (!_amount || isNaN(Number(_amount))) return null;
        try {
          return ethers.parseUnits(_amount, tokenDecimal);
        } catch {
          return null;
        }
    }, [_amount, tokenDecimal]);

    const _min_amount_wei = useMemo(() => {
        if (!_min_amount || isNaN(Number(_min_amount))) return null;
        try {
          return ethers.parseUnits(_min_amount, tokenDecimal);
        } catch {
          return null;
        }
    }, [_min_amount, tokenDecimal]);

    const _max_amount_wei = useMemo(() => {
        if (!_max_amount || isNaN(Number(_max_amount))) return null;
        try {
          return ethers.parseUnits(_max_amount, tokenDecimal);
        } catch {
          return null;
        }
    }, [_max_amount, tokenDecimal]);
    
    const isHubChain = chainId === SUPPORTED_CHAINS_ID[0];

    const { 
        refetch: fetchGasPrice, 
    } = useGetGas({
        messageType: CCIPMessageType.CREATE_LISTING,
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
            amount: _weiAmount ? _weiAmount.toString() : "0",
            minAmount: _min_amount_wei ? _min_amount_wei.toString() : "0",
            maxAmount: _max_amount_wei ? _max_amount_wei.toString() : "0",
            returnDate: _returnDate,
            interest: (_interest * 100),
            tokenAddress: tokenTypeAddress,
            whitelist: whitelist,
            sender: address || "",
        },
      });

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");
        if (!_weiAmount || !_max_amount_wei) {
            return toast.error("Invalid amount values provided.");
        }

        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const contract = getLendbitContract(signer, chainId);
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);


        let toastId: string | number | undefined;

        try {

            toastId = toast.loading(`Checking loan listing...`);


            if (allowanceVal == 0 || allowanceVal < Number(_weiAmount)) {
                if (typeof chainId === 'undefined') {
                    toast.error("Chain ID is undefined - please connect your wallet");
                    return;
                }
            
                toast.loading(`Approving ${tokenName} tokens...`, { id: toastId });
                const allowanceTx = await erc20contract.approve(
                    CHAIN_CONTRACTS[chainId].lendbitAddress, 
                    MaxUint256
                );
                const allowanceReceipt = await allowanceTx.wait();
            
                if (!allowanceReceipt.status) {
                    toast.error("Approval failed!", { id: toastId });
                }
            }
            

            toast.loading(`Processing loan listing of ${_amount}${tokenName}...`, { id: toastId })

            console.log("SEEING VALUES FOR createLoanListingWithMatching",_weiAmount,_min_amount_wei,_max_amount_wei,_returnDate,_interest,tokenTypeAddress );

            let transaction;

            if (isHubChain) {
                transaction = await contract.createLoanListing(
                    _weiAmount,
                    _min_amount_wei,
                    _max_amount_wei,
                    _returnDate,
                    (_interest * 100),
                    tokenTypeAddress,
                    whitelist
                );
            } else {

                let finalGasPrice = 0n;

                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

    
                transaction = await contract.createLoanListing(
                    _weiAmount,
                    _min_amount_wei,
                    _max_amount_wei,
                    _returnDate,
                    (_interest * 100),
                    tokenTypeAddress,
                    whitelist,
                    {
                        value: finalGasPrice,
                    }
                );
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} loan listing order successfully created!`, {
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
                console.error("Transaction failed:", decodedError.reason, error);
                toast.error(`Transaction failed: ${friendlyReason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError, error);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, _weiAmount, _min_amount_wei, _max_amount_wei, walletProvider, tokenTypeAddress, allowanceVal, _amount, tokenName, isHubChain, _returnDate, _interest, whitelist, fetchGasPrice, queryClient, address, navigate, errorDecoder]);
};

export default useCreateLoanListingOrder;