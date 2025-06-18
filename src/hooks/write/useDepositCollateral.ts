import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback, useMemo } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
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
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { CHAIN_CONTRACTS, SUPPORTED_CHAINS_ID } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";
  
const useDepositCollateral = (
    tokenTypeAddress: string,
    _amount: string,
    tokenDecimal: number,
    tokenName: string,
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

    // Only get gas for spoke chains
    const isHubChain = chainId === SUPPORTED_CHAINS_ID[0];

    const { 
        refetch: fetchGasPrice, 
    } = useGetGas({
        messageType: CCIPMessageType.DEPOSIT_COLLATERAL,
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
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);
        const contract = getLendbitContract(signer, chainId);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking deposit collateral transaction...`);

            // Check Allowance and Approve if Needed
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

            toast.loading(`Processing deposit of ${_amount}${tokenName} as collateral...`, { id: toastId });

            // Handle transaction differently for hub vs spoke chains
            let transaction;
            if (isHubChain) {
                // Hub chain - no gas price needed, no value in transaction
                transaction = await contract.depositCollateral(tokenTypeAddress, _weiAmount);
            } else {

                let finalGasPrice = 0n;
                // toast.loading(`Fetching gas price...`, { id: toastId });

                // Spoke chain - get gas price and include in transaction
                const { data } = await fetchGasPrice();
                if (!data?.gasPrice) throw new Error("Failed to get gas price");
                finalGasPrice = BigInt(data?.gasPrice);

                toast.loading(`Processing deposit of ${_amount}${tokenName} as collateral...`, { id: toastId });

                transaction = await contract.depositCollateral(tokenTypeAddress, _weiAmount, {
                    value: finalGasPrice,
                });
            }

            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} successfully deposited as collateral!`, {
                    id: toastId,
                });
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position", address] }),
                ]);
                navigate("/");
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
                console.error("Error decoding failed:", decodeError, error);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, _weiAmount, walletProvider, tokenTypeAddress, allowanceVal, _amount, tokenName, isHubChain, fetchGasPrice, queryClient, address, navigate, errorDecoder]);
};

export default useDepositCollateral;



 